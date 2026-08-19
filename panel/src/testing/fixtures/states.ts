// AUTO-GENERATED demo fixture — a lean snapshot of real entities used by the
// dashboard config, for the Vite dev harness and tests. Not shipped to HA.
import type { HassEntity } from "../../types/hass.js";

export const DEMO_STATES: Record<string, HassEntity> = {
  "light.all_lights": {
    "entity_id": "light.all_lights",
    "state": "on",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "effect_list": [
        "candle",
        "cosmos",
        "enchant",
        "fire",
        "glisten",
        "off",
        "opal",
        "prism",
        "sparkle",
        "sunbeam",
        "sunrise",
        "sunset",
        "underwater"
      ],
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "effect": null,
      "color_mode": "color_temp",
      "brightness": 150,
      "color_temp_kelvin": 3000,
      "hs_color": null,
      "rgb_color": null,
      "xy_color": null,
      "friendly_name": "All lights",
      "supported_features": 44
    },
    "last_changed": "2026-08-18T07:37:13.134820+00:00",
    "last_updated": "2026-08-18T07:37:13.134820+00:00"
  },
  "light.living_room_living_room": {
    "entity_id": "light.living_room_living_room",
    "state": "on",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "color_mode": "color_temp",
      "brightness": 180,
      "color_temp_kelvin": 2700,
      "hs_color": null,
      "rgb_color": null,
      "xy_color": null,
      "is_hue_group": true,
      "hue_scenes": [
        "movie"
      ],
      "hue_type": "room",
      "dynamics": false,
      "friendly_name": "Living room",
      "supported_features": 40
    },
    "last_changed": "2026-08-18T21:40:49.966391+00:00",
    "last_updated": "2026-08-18T21:40:49.966391+00:00"
  },
  "light.living_room_living_room_table_lamp": {
    "entity_id": "light.living_room_living_room_table_lamp",
    "state": "on",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "effect_list": [
        "off",
        "candle",
        "fire",
        "prism",
        "sparkle",
        "opal",
        "glisten"
      ],
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "effect": null,
      "color_mode": "xy",
      "brightness": 120,
      "color_temp_kelvin": null,
      "hs_color": null,
      "rgb_color": [
        255,
        150,
        60
      ],
      "xy_color": null,
      "mode": "normal",
      "dynamics": "none",
      "friendly_name": "Living room table lamp",
      "supported_features": 44
    },
    "last_changed": "2026-08-18T21:40:49.933095+00:00",
    "last_updated": "2026-08-18T21:40:49.933095+00:00"
  },
  "light.kitchen": {
    "entity_id": "light.kitchen",
    "state": "on",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "color_mode": "color_temp",
      "brightness": 220,
      "color_temp_kelvin": 4000,
      "hs_color": null,
      "rgb_color": null,
      "xy_color": null,
      "is_hue_group": true,
      "hue_scenes": [],
      "hue_type": "zone",
      "dynamics": false,
      "friendly_name": "Kitchen",
      "supported_features": 40
    },
    "last_changed": "2026-08-18T20:34:52.531081+00:00",
    "last_updated": "2026-08-18T20:34:52.531081+00:00"
  },
  "light.dining": {
    "entity_id": "light.dining",
    "state": "off",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "color_mode": null,
      "brightness": null,
      "color_temp_kelvin": null,
      "hs_color": null,
      "rgb_color": null,
      "xy_color": null,
      "is_hue_group": true,
      "hue_scenes": [],
      "hue_type": "zone",
      "dynamics": false,
      "friendly_name": "Dining",
      "supported_features": 40
    },
    "last_changed": "2026-08-18T20:33:38.069731+00:00",
    "last_updated": "2026-08-18T20:33:38.069731+00:00"
  },
  "light.bedroom_bedroom": {
    "entity_id": "light.bedroom_bedroom",
    "state": "on",
    "attributes": {
      "min_color_temp_kelvin": 2202,
      "max_color_temp_kelvin": 6535,
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "color_mode": "xy",
      "brightness": 17,
      "color_temp_kelvin": null,
      "hs_color": [
        33.767,
        84.314
      ],
      "rgb_color": [
        255,
        161,
        40
      ],
      "xy_color": [
        0.561,
        0.4042
      ],
      "is_hue_group": true,
      "hue_scenes": [
        "Bed tables",
        "Relax",
        "Dimmed",
        "Read",
        "Nightlight",
        "Concentrate"
      ],
      "hue_type": "room",
      "dynamics": false,
      "friendly_name": "Bedroom",
      "supported_features": 40
    },
    "last_changed": "2026-08-18T18:56:02.261718+00:00",
    "last_updated": "2026-08-18T20:14:21.333196+00:00"
  },
  "light.bedroom_bens_bed_table": {
    "entity_id": "light.bedroom_bens_bed_table",
    "state": "on",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "effect_list": [
        "off",
        "candle",
        "fire",
        "prism",
        "sparkle",
        "opal",
        "glisten",
        "underwater",
        "cosmos",
        "sunbeam",
        "enchant",
        "sunrise",
        "sunset"
      ],
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "effect": "off",
      "color_mode": "xy",
      "brightness": 17,
      "color_temp_kelvin": null,
      "hs_color": [
        33.767,
        84.314
      ],
      "rgb_color": [
        255,
        161,
        40
      ],
      "xy_color": [
        0.561,
        0.4042
      ],
      "mode": "normal",
      "dynamics": "none",
      "friendly_name": "Ben’s bed table",
      "supported_features": 44
    },
    "last_changed": "2026-08-18T18:56:02.254432+00:00",
    "last_updated": "2026-08-18T20:14:21.319547+00:00"
  },
  "light.bedroom_ilonas_bed_table": {
    "entity_id": "light.bedroom_ilonas_bed_table",
    "state": "on",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "effect_list": [
        "off",
        "candle",
        "fire",
        "prism",
        "sparkle",
        "opal",
        "glisten",
        "underwater",
        "cosmos",
        "sunbeam",
        "enchant",
        "sunrise",
        "sunset"
      ],
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "effect": "off",
      "color_mode": "xy",
      "brightness": 17,
      "color_temp_kelvin": null,
      "hs_color": [
        33.767,
        84.314
      ],
      "rgb_color": [
        255,
        161,
        40
      ],
      "xy_color": [
        0.561,
        0.4042
      ],
      "mode": "normal",
      "dynamics": "none",
      "friendly_name": "Ilona’s bed table",
      "supported_features": 44
    },
    "last_changed": "2026-08-18T18:56:02.245696+00:00",
    "last_updated": "2026-08-18T20:14:21.331236+00:00"
  },
  "light.mias_bedroom_mias_bedroom": {
    "entity_id": "light.mias_bedroom_mias_bedroom",
    "state": "off",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "color_mode": null,
      "brightness": null,
      "color_temp_kelvin": null,
      "hs_color": null,
      "rgb_color": null,
      "xy_color": null,
      "is_hue_group": true,
      "hue_scenes": [],
      "hue_type": "room",
      "dynamics": false,
      "friendly_name": "Mia’s bedroom",
      "supported_features": 40
    },
    "last_changed": "2026-08-18T07:37:08.670560+00:00",
    "last_updated": "2026-08-18T07:37:08.670560+00:00"
  },
  "light.juliens_bedroom_juliens_bedroom": {
    "entity_id": "light.juliens_bedroom_juliens_bedroom",
    "state": "off",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "color_mode": null,
      "brightness": null,
      "color_temp_kelvin": null,
      "hs_color": null,
      "rgb_color": null,
      "xy_color": null,
      "is_hue_group": true,
      "hue_scenes": [],
      "hue_type": "room",
      "dynamics": false,
      "friendly_name": "Julien’s bedroom",
      "supported_features": 40
    },
    "last_changed": "2026-08-18T07:37:08.667474+00:00",
    "last_updated": "2026-08-18T07:37:08.667474+00:00"
  },
  "light.juliens_bedroom_hue_go_julien": {
    "entity_id": "light.juliens_bedroom_hue_go_julien",
    "state": "off",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "effect_list": [
        "off",
        "candle",
        "fire",
        "prism",
        "sparkle",
        "opal",
        "glisten",
        "underwater",
        "cosmos",
        "sunbeam",
        "enchant",
        "sunrise",
        "sunset"
      ],
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "effect": null,
      "color_mode": null,
      "brightness": null,
      "color_temp_kelvin": null,
      "hs_color": null,
      "rgb_color": null,
      "xy_color": null,
      "mode": "normal",
      "dynamics": "none",
      "friendly_name": "Hue Go Julien",
      "supported_features": 44
    },
    "last_changed": "2026-08-18T07:37:08.652323+00:00",
    "last_updated": "2026-08-18T07:37:08.652323+00:00"
  },
  "light.bens_office_bens_office": {
    "entity_id": "light.bens_office_bens_office",
    "state": "off",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "color_mode": null,
      "brightness": null,
      "color_temp_kelvin": null,
      "hs_color": null,
      "rgb_color": null,
      "xy_color": null,
      "is_hue_group": true,
      "hue_scenes": [],
      "hue_type": "room",
      "dynamics": false,
      "friendly_name": "Ben’s office",
      "supported_features": 40
    },
    "last_changed": "2026-08-18T21:53:30.172802+00:00",
    "last_updated": "2026-08-18T21:53:30.172802+00:00"
  },
  "light.bens_office_bens_screen": {
    "entity_id": "light.bens_office_bens_screen",
    "state": "off",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "effect_list": [
        "off",
        "candle",
        "fire",
        "prism",
        "sparkle",
        "opal",
        "glisten",
        "underwater",
        "cosmos",
        "sunbeam",
        "enchant",
        "sunrise",
        "sunset"
      ],
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "effect": null,
      "color_mode": null,
      "brightness": null,
      "color_temp_kelvin": null,
      "hs_color": null,
      "rgb_color": null,
      "xy_color": null,
      "mode": "normal",
      "dynamics": "none",
      "friendly_name": "Ben’s screen",
      "supported_features": 44
    },
    "last_changed": "2026-08-18T21:53:30.167589+00:00",
    "last_updated": "2026-08-18T21:53:30.167589+00:00"
  },
  "light.playground_playground": {
    "entity_id": "light.playground_playground",
    "state": "off",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "color_mode": null,
      "brightness": null,
      "color_temp_kelvin": null,
      "hs_color": null,
      "rgb_color": null,
      "xy_color": null,
      "is_hue_group": true,
      "hue_scenes": [],
      "hue_type": "room",
      "dynamics": false,
      "friendly_name": "Playground",
      "supported_features": 40
    },
    "last_changed": "2026-08-18T07:37:08.673526+00:00",
    "last_updated": "2026-08-18T07:37:08.673526+00:00"
  },
  "light.hallway_hallway": {
    "entity_id": "light.hallway_hallway",
    "state": "off",
    "attributes": {
      "min_color_temp_kelvin": 2202,
      "max_color_temp_kelvin": 6535,
      "supported_color_modes": [
        "color_temp"
      ],
      "color_mode": null,
      "brightness": null,
      "color_temp_kelvin": null,
      "hs_color": null,
      "rgb_color": null,
      "xy_color": null,
      "is_hue_group": true,
      "hue_scenes": [],
      "hue_type": "room",
      "dynamics": false,
      "friendly_name": "Hallway",
      "supported_features": 40
    },
    "last_changed": "2026-08-18T07:48:51.371890+00:00",
    "last_updated": "2026-08-18T07:48:51.371890+00:00"
  },
  "light.corridor_corridor": {
    "entity_id": "light.corridor_corridor",
    "state": "on",
    "attributes": {
      "min_color_temp_kelvin": 2000,
      "max_color_temp_kelvin": 6535,
      "supported_color_modes": [
        "color_temp",
        "xy"
      ],
      "color_mode": "xy",
      "brightness": 24,
      "color_temp_kelvin": null,
      "hs_color": [
        33.767,
        84.314
      ],
      "rgb_color": [
        255,
        161,
        40
      ],
      "xy_color": [
        0.561,
        0.4042
      ],
      "is_hue_group": true,
      "hue_scenes": [
        "Nightlight"
      ],
      "hue_type": "room",
      "dynamics": false,
      "friendly_name": "Corridor",
      "supported_features": 40
    },
    "last_changed": "2026-08-18T18:56:02.243003+00:00",
    "last_updated": "2026-08-18T18:56:02.243003+00:00"
  },
  "switch.kitchen_adaptive_lighting_kitchen": {
    "entity_id": "switch.kitchen_adaptive_lighting_kitchen",
    "state": "on",
    "attributes": {
      "configuration": {},
      "manual_control": [],
      "brightness_pct": 4.854305306159575,
      "color_temp_kelvin": 2000,
      "color_temp_mired": 500,
      "rgb_color": [
        255,
        137,
        14
      ],
      "xy_color": [
        0.598,
        0.383
      ],
      "hs_color": [
        30.504,
        93.333
      ],
      "sun_position": -0.9610676231701053,
      "force_rgb_color": false,
      "autoreset_time_remaining": {},
      "icon": "mdi:theme-light-dark",
      "friendly_name": "Kitchen Adaptive Lighting: Kitchen"
    },
    "last_changed": "2026-08-18T20:24:03.447557+00:00",
    "last_updated": "2026-08-18T22:47:20.994340+00:00"
  },
  "switch.dining_adaptive_lighting_dining": {
    "entity_id": "switch.dining_adaptive_lighting_dining",
    "state": "on",
    "attributes": {
      "configuration": {},
      "manual_control": [],
      "brightness_pct": 4.79867484224132,
      "color_temp_kelvin": 2000,
      "color_temp_mired": 500,
      "rgb_color": [
        255,
        137,
        14
      ],
      "xy_color": [
        0.598,
        0.383
      ],
      "hs_color": [
        30.504,
        93.333
      ],
      "sun_position": -0.9616295470480675,
      "force_rgb_color": false,
      "autoreset_time_remaining": {},
      "icon": "mdi:theme-light-dark",
      "friendly_name": "Dining Adaptive Lighting: Dining"
    },
    "last_changed": "2026-08-18T20:24:28.227105+00:00",
    "last_updated": "2026-08-18T22:47:45.830375+00:00"
  },
  "switch.other_tesla_model_3_sentry_mode": {
    "entity_id": "switch.other_tesla_model_3_sentry_mode",
    "state": "off",
    "attributes": {
      "device_class": "switch",
      "friendly_name": "Tesla Model 3 Sentry mode"
    },
    "last_changed": "2026-08-18T08:57:12.381113+00:00",
    "last_updated": "2026-08-18T08:57:12.381113+00:00"
  },
  "climate.ec3a56bc6527": {
    "entity_id": "climate.ec3a56bc6527",
    "state": "cool",
    "attributes": {
      "hvac_modes": [
        "off",
        "cool",
        "heat",
        "fan_only",
        "dry",
        "auto"
      ],
      "min_temp": 18,
      "max_temp": 30,
      "target_temp_step": 0.5,
      "fan_modes": [
        "Quiet",
        "low",
        "medium",
        "high",
        "auto"
      ],
      "preset_modes": [
        "none",
        "Minimum Heat"
      ],
      "swing_modes": [
        "Vertical Swing",
        "Highest",
        "High",
        "Low",
        "Lowest"
      ],
      "current_temperature": 25.8,
      "temperature": 23,
      "fan_mode": "Quiet",
      "preset_mode": "none",
      "swing_mode": "Vertical Swing",
      "wifi_led": "1",
      "indoor_tmp": "7575",
      "outdoor_tmp": "6900",
      "pow_cons": "34019",
      "model": "ASEH14KJCAL",
      "hmn_det": "1",
      "onoff": "0",
      "op_mode": "4",
      "fan_spd": "2",
      "set_tmp": "230",
      "af_inc_vrt": "4",
      "af_dir_vrt": "1",
      "af_swg_vrt": "1",
      "af_swg_hrz": "1",
      "af_dir_hrz": "3",
      "ou_low_noise": "0",
      "fan_ctrl": "1",
      "hmn_det_auto_save": "0",
      "min_heat": "0",
      "powerful": "0",
      "economy": "1",
      "err_code": "0",
      "demand": "0",
      "fltr_sign_reset": "65535",
      "friendly_name": "Airco",
      "supported_features": 441
    },
    "last_changed": "2026-08-18T07:37:09.015676+00:00",
    "last_updated": "2026-08-18T22:46:46.283003+00:00"
  },
  "climate.other_tesla_model_3_climate": {
    "entity_id": "climate.other_tesla_model_3_climate",
    "state": "off",
    "attributes": {
      "hvac_modes": [
        "heat_cool",
        "off"
      ],
      "min_temp": 15,
      "max_temp": 28,
      "preset_modes": [
        "off",
        "keep",
        "dog",
        "camp"
      ],
      "current_temperature": 21.5,
      "temperature": 22,
      "preset_mode": "off",
      "friendly_name": "Tesla Model 3 Climate",
      "supported_features": 401
    },
    "last_changed": "2026-08-18T20:07:17.402102+00:00",
    "last_updated": "2026-08-18T22:47:18.100635+00:00"
  },
  "media_player.tv_tv": {
    "entity_id": "media_player.tv_tv",
    "state": "playing",
    "attributes": {
      "source_list": [
        "App Store",
        "Arcade",
        "Auvio",
        "Computers",
        "FaceTime",
        "Fitness",
        "HBO Max",
        "Infuse",
        "Music",
        "Netflix",
        "NordVPN",
        "Photos",
        "Pilot WP",
        "Podcasts",
        "Prime Video",
        "Search",
        "Settings",
        "SkyShowtime",
        "Speedtest",
        "TV",
        "YouTube"
      ],
      "media_content_type": "video",
      "media_duration": 3471,
      "media_position": 0,
      "media_position_updated_at": "2026-08-18T21:30:56.600119+00:00",
      "media_title": "Peaky Blinders - S4 ∙ E5 - The Duel",
      "app_id": "com.firecore.infuse",
      "app_name": "Infuse",
      "entity_picture": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22320%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%2523c2410c%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%25231e293b%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22320%22%20height%3D%22320%22%20fill%3D%22url(%2523g)%22%2F%3E%3C%2Fsvg%3E",
      "friendly_name": "TV",
      "supported_features": 450487
    },
    "last_changed": "2026-08-18T21:30:56.602080+00:00",
    "last_updated": "2026-08-18T21:30:56.602080+00:00"
  },
  "media_player.ht_a9_2": {
    "entity_id": "media_player.ht_a9_2",
    "state": "off",
    "attributes": {
      "source_list": [
        "TV",
        "HDMI",
        "Bluetooth Audio"
      ],
      "sound_mode_list": [
        "Auto Sound",
        "Cinema",
        "Music",
        "Standard Surround"
      ],
      "device_class": "receiver",
      "friendly_name": "HT-A9",
      "supported_features": 69004
    },
    "last_changed": "2026-08-18T21:30:55.927308+00:00",
    "last_updated": "2026-08-18T21:30:55.927308+00:00"
  },
  "vacuum.roborock_s8_pro_ultra": {
    "entity_id": "vacuum.roborock_s8_pro_ultra",
    "state": "docked",
    "attributes": {
      "fan_speed_list": [
        "quiet",
        "balanced",
        "turbo",
        "max",
        "max_plus",
        "off",
        "custom"
      ],
      "fan_speed": "max",
      "friendly_name": "Roborock S8 Pro Ultra",
      "supported_features": 30524
    },
    "last_changed": "2026-08-18T07:37:09.480520+00:00",
    "last_updated": "2026-08-18T07:37:09.480520+00:00"
  },
  "scene.living_room_living_room_movie": {
    "entity_id": "scene.living_room_living_room_movie",
    "state": "2026-08-18T20:33:36.783485+00:00",
    "attributes": {
      "group_name": "Living room",
      "group_type": "room",
      "name": "movie",
      "speed": 0.603,
      "brightness": 66,
      "is_dynamic": true,
      "friendly_name": "Living room movie"
    },
    "last_changed": "2026-08-18T20:33:36.783690+00:00",
    "last_updated": "2026-08-18T20:33:36.783690+00:00"
  },
  "scene.bedroom_bedroom_read": {
    "entity_id": "scene.bedroom_bedroom_read",
    "state": "2026-08-09T14:56:39.082847+00:00",
    "attributes": {
      "group_name": "Bedroom",
      "group_type": "room",
      "name": "Read",
      "speed": 0.603,
      "brightness": 255,
      "is_dynamic": false,
      "friendly_name": "Bedroom Read"
    },
    "last_changed": "2026-08-18T07:37:08.685217+00:00",
    "last_updated": "2026-08-18T07:37:08.685217+00:00"
  },
  "scene.bedroom_bedroom_nightlight": {
    "entity_id": "scene.bedroom_bedroom_nightlight",
    "state": "2026-08-12T19:32:34.894593+00:00",
    "attributes": {
      "group_name": "Bedroom",
      "group_type": "room",
      "name": "Nightlight",
      "speed": 0.603,
      "brightness": 26,
      "is_dynamic": false,
      "friendly_name": "Bedroom Nightlight"
    },
    "last_changed": "2026-08-18T07:37:08.684322+00:00",
    "last_updated": "2026-08-18T07:37:08.684322+00:00"
  },
  "script.goodnight": {
    "entity_id": "script.goodnight",
    "state": "off",
    "attributes": {
      "last_triggered": "2026-08-12T19:32:33.147614+00:00",
      "mode": "single",
      "current": 0,
      "friendly_name": "Goodnight"
    },
    "last_changed": "2026-08-18T07:36:50.808840+00:00",
    "last_updated": "2026-08-18T07:36:50.808840+00:00"
  },
  "person.ben": {
    "entity_id": "person.ben",
    "state": "home",
    "attributes": {
      "editable": true,
      "id": "ben",
      "device_trackers": [
        "device_tracker.iphone_16_pro"
      ],
      "in_zones": [
        "zone.home"
      ],
      "latitude": 50.64120745655599,
      "longitude": 4.601604672545154,
      "gps_accuracy": 14.195014,
      "source": "device_tracker.iphone_16_pro",
      "user_id": "6e1349fc31db41eba3c47fec6dc23c3f",
      "entity_picture": "/api/image/serve/bf1e3a19ed53c118e8e9d319e462fc2c/512x512",
      "friendly_name": "Ben"
    },
    "last_changed": "2026-08-18T07:36:51.433352+00:00",
    "last_updated": "2026-08-18T07:37:13.135462+00:00"
  },
  "weather.forecast_home": {
    "entity_id": "weather.forecast_home",
    "state": "partlycloudy",
    "attributes": {
      "temperature": 19.6,
      "dew_point": 19,
      "temperature_unit": "°C",
      "humidity": 95,
      "cloud_coverage": 58.6,
      "uv_index": 0,
      "pressure": 1010.6,
      "pressure_unit": "hPa",
      "wind_bearing": 241,
      "wind_speed": 16.2,
      "wind_speed_unit": "km/h",
      "visibility_unit": "km",
      "precipitation_unit": "mm",
      "attribution": "Weather forecast from met.no, delivered by the Norwegian Meteorological Institute.",
      "friendly_name": "Forecast Home",
      "supported_features": 3
    },
    "last_changed": "2026-08-18T22:33:09.023327+00:00",
    "last_updated": "2026-08-18T22:33:09.023327+00:00"
  },
  "cover.other_tesla_model_3_trunk": {
    "entity_id": "cover.other_tesla_model_3_trunk",
    "state": "closed",
    "attributes": {
      "is_closed": true,
      "device_class": "door",
      "friendly_name": "Tesla Model 3 Trunk",
      "supported_features": 3
    },
    "last_changed": "2026-08-18T08:57:12.365174+00:00",
    "last_updated": "2026-08-18T08:57:12.365174+00:00"
  },
  "lock.other_tesla_model_3_lock": {
    "entity_id": "lock.other_tesla_model_3_lock",
    "state": "locked",
    "attributes": {
      "friendly_name": "Tesla Model 3 Lock",
      "supported_features": 0
    },
    "last_changed": "2026-08-18T08:57:12.371699+00:00",
    "last_updated": "2026-08-18T08:57:12.371699+00:00"
  },
  "sensor.other_tesla_model_3_battery_level": {
    "entity_id": "sensor.other_tesla_model_3_battery_level",
    "state": "55",
    "attributes": {
      "state_class": "measurement",
      "unit_of_measurement": "%",
      "device_class": "battery",
      "friendly_name": "Tesla Model 3 Battery level"
    },
    "last_changed": "2026-08-18T21:57:17.360090+00:00",
    "last_updated": "2026-08-18T21:57:17.360090+00:00"
  },
  "sensor.next_collection": {
    "entity_id": "sensor.next_collection",
    "state": "PMD in 0d",
    "attributes": {
      "2026-08-19": "PMD",
      "2026-08-24": "Déchets organiques",
      "2026-08-26": "Paper-cardboard",
      "2026-08-31": "Déchets ménagers résiduels, Déchets organiques",
      "2026-09-02": "PMD",
      "2026-09-07": "Déchets organiques",
      "2026-09-14": "Déchets ménagers résiduels, Déchets organiques",
      "2026-09-16": "PMD",
      "2026-09-21": "Déchets organiques",
      "2026-09-23": "Paper-cardboard",
      "2026-09-28": "Déchets ménagers résiduels, Déchets organiques, Déchets verts",
      "2026-09-30": "PMD",
      "2026-10-05": "Déchets organiques, Déchets verts",
      "2026-10-12": "Déchets ménagers résiduels, Déchets organiques",
      "attribution": "Last update: 08/18/26 09:36:50",
      "icon": "mdi:trash-can",
      "friendly_name": "Next collection"
    },
    "last_changed": "2026-08-18T22:00:00.177213+00:00",
    "last_updated": "2026-08-18T22:00:00.177213+00:00"
  },
  "sensor.hp_laserjet_pro_m404_m405": {
    "entity_id": "sensor.hp_laserjet_pro_m404_m405",
    "state": "idle",
    "attributes": {
      "options": [
        "idle",
        "printing",
        "stopped"
      ],
      "info": "HP LaserJet Pro M404-M405 [D1DE3C]",
      "serial": "PHFSB19304",
      "location": "",
      "state_message": "",
      "state_reason": null,
      "command_set": "PCL5c,PCLXL,POSTSCRIPT,PDF,PJL,Automatic,JPEG,AppleRaster,PWGRaster,PCLM,802.11,802.3,DESKJET,DYN",
      "uri_supported": "ipp://192.168.30.227/ipp/print,ipps://192.168.30.227:631/ipp/print",
      "device_class": "enum",
      "friendly_name": "HP LaserJet Pro M404-M405"
    },
    "last_changed": "2026-08-18T07:37:07.556572+00:00",
    "last_updated": "2026-08-18T07:37:07.556572+00:00"
  },
  "sensor.p1_meter_power": {
    "entity_id": "sensor.p1_meter_power",
    "state": "196.0",
    "attributes": {
      "state_class": "measurement",
      "unit_of_measurement": "W",
      "device_class": "power",
      "friendly_name": "P1 Meter Power"
    },
    "last_changed": "2026-08-18T22:47:59.137553+00:00",
    "last_updated": "2026-08-18T22:47:59.137553+00:00"
  },
  "sensor.tesla_wall_connector_status": {
    "entity_id": "sensor.tesla_wall_connector_status",
    "state": "not_connected",
    "attributes": {
      "options": [
        "booting",
        "not_connected",
        "connected",
        "ready",
        "negotiating",
        "error",
        "charging_finished",
        "waiting_car",
        "charging_reduced",
        "charging"
      ],
      "device_class": "enum",
      "friendly_name": "Tesla Wall Connector Status"
    },
    "last_changed": "2026-08-18T07:37:08.765327+00:00",
    "last_updated": "2026-08-18T07:37:08.765327+00:00"
  },
  "sensor.goodwe_today_s_pv_generation": {
    "entity_id": "sensor.goodwe_today_s_pv_generation",
    "state": "0",
    "attributes": {
      "state_class": "total_increasing",
      "unit_of_measurement": "kWh",
      "device_class": "energy",
      "icon": "mdi:solar-power",
      "friendly_name": "GoodWe Today's PV Generation"
    },
    "last_changed": "2026-08-18T22:00:00.024024+00:00",
    "last_updated": "2026-08-18T22:00:00.024024+00:00"
  },
  "sensor.energy_forecast_end_of_day": {
    "entity_id": "sensor.energy_forecast_end_of_day",
    "state": "6.64",
    "attributes": {
      "unit_of_measurement": "kWh",
      "device_class": "energy",
      "icon": "mdi:crystal-ball",
      "friendly_name": "Energy Forecast End Of Day"
    },
    "last_changed": "2026-08-18T22:47:54.208366+00:00",
    "last_updated": "2026-08-18T22:47:54.208366+00:00"
  },
  "sensor.p1_meter_energy_import": {
    "entity_id": "sensor.p1_meter_energy_import",
    "state": "14278.88",
    "attributes": {
      "state_class": "total_increasing",
      "unit_of_measurement": "kWh",
      "device_class": "energy",
      "friendly_name": "P1 Meter Energy import"
    },
    "last_changed": "2026-08-18T22:47:54.205019+00:00",
    "last_updated": "2026-08-18T22:47:54.205019+00:00"
  },
  "sensor.p1_meter_energy_export": {
    "entity_id": "sensor.p1_meter_energy_export",
    "state": "10858.551",
    "attributes": {
      "state_class": "total_increasing",
      "unit_of_measurement": "kWh",
      "device_class": "energy",
      "friendly_name": "P1 Meter Energy export"
    },
    "last_changed": "2026-08-18T17:24:07.153388+00:00",
    "last_updated": "2026-08-18T17:24:07.153388+00:00"
  },
  "sensor.goodwe_pv_power": {
    "entity_id": "sensor.goodwe_pv_power",
    "state": "unavailable",
    "attributes": {
      "state_class": "measurement",
      "unit_of_measurement": "W",
      "device_class": "power",
      "icon": "mdi:solar-power",
      "friendly_name": "GoodWe PV Power"
    },
    "last_changed": "2026-08-18T19:22:39.942904+00:00",
    "last_updated": "2026-08-18T19:22:39.942904+00:00"
  },
  "sensor.helios_forecast_energy_today_remaining": {
    "entity_id": "sensor.helios_forecast_energy_today_remaining",
    "state": "14.1118051373638",
    "attributes": {
      "unit_of_measurement": "kWh",
      "device_class": "energy",
      "friendly_name": "Helios Forecast Energy today remaining"
    },
    "last_changed": "2026-08-18T22:37:58.620255+00:00",
    "last_updated": "2026-08-18T22:37:58.620255+00:00"
  }
};
