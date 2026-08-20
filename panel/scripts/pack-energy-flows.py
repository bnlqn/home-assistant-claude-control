#!/usr/bin/env python3
"""Pack Homey Energy frame folders into browser-native animated WebPs.

Usage from panel/:
  python3 scripts/pack-energy-flows.py flow-sequences public/assets/energy-flows

The source can be recreated with scripts/fetch-energy-flows.sh. Pillow must be
built with WebP animation support. Grid import is the export sequence reversed,
matching the former canvas playback behavior.
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from PIL import Image, features

FRAME_COUNT = 113
FRAME_DURATION_MS = 33
STILL_FRAME_INDEX = FRAME_COUNT // 2
FLOW_NAMES = (
    "solar-generating",
    "grid-exporting",
    "home-consuming",
    "ev-charging",
)


def load_frames(source: Path, name: str) -> list[Image.Image]:
    frames: list[Image.Image] = []
    for index in range(FRAME_COUNT):
        path = source / name / f"{name}.{index}.webp"
        if not path.is_file():
            raise FileNotFoundError(f"Missing frame: {path}")
        with Image.open(path) as image:
            frames.append(image.convert("RGBA"))
    return frames


def save_animation(frames: list[Image.Image], destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        destination,
        format="WEBP",
        save_all=True,
        append_images=frames[1:],
        duration=FRAME_DURATION_MS,
        loop=0,
        lossless=False,
        quality=90,
        # Method 4 keeps the one-time conversion practical while staying well
        # below the source-sequence transfer size at the chosen quality.
        method=4,
        minimize_size=True,
        allow_mixed=True,
    )
    with Image.open(destination) as packed:
        # The WebP muxer merges visually identical adjacent source frames and
        # carries their combined duration, so the packed frame count can be
        # lower than the source count without changing playback.
        if not packed.is_animated or packed.n_frames < 2:
            raise RuntimeError(
                f"{destination} is not a usable animated WebP",
            )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Directory containing one folder per flow")
    parser.add_argument("destination", type=Path, help="Output directory for animated WebPs")
    args = parser.parse_args()

    if not features.check("webp_anim"):
        raise RuntimeError("This Pillow installation has no animated WebP support")

    for name in FLOW_NAMES:
        frames = load_frames(args.source, name)
        save_animation(frames, args.destination / f"{name}.webp")
        shutil.copyfile(
            args.source / name / f"{name}.{STILL_FRAME_INDEX}.webp",
            args.destination / f"{name}-still.webp",
        )
        if name == "grid-exporting":
            save_animation(list(reversed(frames)), args.destination / "grid-importing.webp")
            shutil.copyfile(
                args.source / name / f"{name}.{STILL_FRAME_INDEX}.webp",
                args.destination / "grid-importing-still.webp",
            )


if __name__ == "__main__":
    main()
