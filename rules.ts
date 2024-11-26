import type { KarabinerRule } from './types';
import { app, createHomeRowMods, createHyperSubLayers, hyper, open, vsCodeFnSwitch } from './utils';

export const complexModifications: KarabinerRule[] = [
	// Define the Hyper key
	{
		description: 'Hyper Key (⌃⌥⇧⌘)',
		manipulators: [
			{
				description: 'Caps Lock -> Hyper Key',
				from: {
					key_code: 'caps_lock',
					modifiers: {
						optional: ['any'],
					},
				},
				to: [
					{
						set_variable: {
							name: 'hyper',
							value: 1,
						},
					},
				],
				to_after_key_up: [
					{
						set_variable: {
							name: 'hyper',
							value: 0,
						},
					},
				],
				to_if_alone: [
					{
						key_code: 'escape',
					},
				],
				type: 'basic',
			},
			//      {
			//        type: "basic",
			//        description: "Disable CMD + Tab to force Hyper Key usage",
			//        from: {
			//          key_code: "tab",
			//          modifiers: {
			//            mandatory: ["left_command"],
			//          },
			//        },
			//        to: [
			//          {
			//            key_code: "tab",
			//          },
			//        ],
			//      },
		],
	},
	...createHyperSubLayers({
		// b = "B"rowse
		b: {},
		// e for "Edit"
		e: {
			h: {
				to: [{ key_code: 'left_arrow' }],
			},
			j: {
				to: [{ key_code: 'down_arrow' }],
			},
			k: {
				to: [{ key_code: 'up_arrow' }],
			},
			l: {
				to: [{ key_code: 'right_arrow' }],
			},
			u: {
				to: [{ key_code: 'page_up' }],
			},
			m: {
				to: [{ key_code: 'page_down' }],
			},
			y: {
				to: [{ key_code: 'left_arrow', modifiers: ['left_command', 'left_shift'] }],
			},
			n: {
				to: [{ key_code: 'left_arrow', modifiers: ['left_command', 'left_shift'] }],
			},
			o: {
				to: [{ key_code: 'left_arrow', modifiers: hyper }], // emmet - balance Outward
			},
			i: {
				to: [{ key_code: 'right_arrow', modifiers: hyper }], // emmet - balance Inward
			},
			p: {
				to: [{ key_code: 'right_arrow', modifiers: ['left_command', 'left_shift'] }],
			},
			return_or_enter: {
				to: [{ key_code: 'f12' }], // vscode - go to definition
			},
			g: {
				to: [{ key_code: 'right_arrow', modifiers: ['left_control', 'left_command'] }], // vscode - next Group
			},
		},
		// o = "Open" applications
		o: {
			1: app('1Password'),
			a: app('Arc'),
			b: app('Obsidian'),
			c: app('Notion Calendar'),
			v: app('Cursor'),
			d: app('Discord'),
			s: app('Slack'),
			n: app('Notion'),
			m: app('WhatsApp'),
			w: app('Warp'),
			f: app('Finder'),
			p: app('Spotify'),
			h: app('HTTPie'),
		},
		// s = "System"
		s: {
			u: {
				to: [
					{
						key_code: 'volume_increment',
					},
				],
			},
			j: {
				to: [
					{
						key_code: 'volume_decrement',
					},
				],
			},
			i: {
				to: [
					{
						key_code: 'display_brightness_increment',
					},
				],
			},
			k: {
				to: [
					{
						key_code: 'display_brightness_decrement',
					},
				],
			},
			l: {
				to: [
					{
						key_code: 'q',
						modifiers: ['right_control', 'right_command'], // Lock screen
					},
				],
			},
			p: {
				to: [
					{
						key_code: 'play_or_pause',
					},
				],
			},
			semicolon: {
				to: [
					{
						key_code: 'fastforward',
					},
				],
			},
			// "D"o not disturb toggle
			d: open(`raycast://extensions/yakitrak/do-not-disturb/toggle`),
		},

		// c = Musi*c* which isn't "m" because we want it to be on the left hand
		c: {
			p: {
				to: [{ key_code: 'play_or_pause' }],
			},
			n: {
				to: [{ key_code: 'fastforward' }],
			},
			b: {
				to: [{ key_code: 'rewind' }],
			},
		},
		// r = "Raycast"
		r: {
			1: open('raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1'),
			2: open('raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2'),
			a: open('raycast://extensions/raycast/raycast-ai/ai-chat'),
			b: open('raycast://extensions/raycast/system/toggle-bluetooth'),
			c: open('raycast://extensions/raycast/system/open-camera'),
			e: open('raycast://extensions/raycast/emoji-symbols/search-emoji-symbols'),
			h: open('raycast://extensions/raycast/clipboard-history/clipboard-history'),
			n: open('raycast://script-commands/dismiss-notifications'),
			p: open('raycast://extensions/raycast/raycast/confetti'),
			t: open('raycast://extensions/raycast/system/toggle-system-appearance'),
		},
		// w = "Window management"
		w: {
			h: open('raycast://extensions/raycast/window-management/left-half'),
			j: open('raycast://extensions/raycast/window-management/bottom-right-quarter'),
			k: open('raycast://extensions/raycast/window-management/top-right-quarter'),
			l: open('raycast://extensions/raycast/window-management/right-half'),
			f: open('raycast://extensions/raycast/window-management/maximize'),
		},
	}),
	// switches the fn keys in vscode
	vsCodeFnSwitch(),
];
