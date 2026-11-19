import { tinycast } from './tinycast';
import type { KarabinerRule } from './types';
import { app, createHyperSubLayers, open, vsCodeFnSwitch, fnKeyRemapping } from './utils';

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
	...fnKeyRemapping(),
	...createHyperSubLayers({
		b: app('Helium'),
		c: app('Zed'),
		j: { to: [{ shell_command: "open -a 'T3 Code (Beta).app'" }] },
		k: { to: [{ shell_command: "open -a 'Daylight.app'" }] },
		l: { to: [{ shell_command: "open -a 'Linear.app'" }] },
		m: app('Spotify'),
		t: {
			to: [{ shell_command: "open -a 'Rex Beta.app'" }],
		},
		p: app('1Password'),
		f: app('Finder'),
		s: app('Slack'),
		o: app('Obsidian'),
		n: app('Notion'),
		// Keep the familiar r sublayer for Tinycast.
		r: {
			1: open('tinycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1'),
			2: open('tinycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2'),
			a: tinycast('ai'),
			b: tinycast('bluetooth'),
			c: tinycast('camera'),
			e: tinycast('emoji'),
			h: tinycast('clipboard'),
			n: tinycast('notifications'),
			t: tinycast('appearance'),
		},
		open_bracket: tinycast('leftHalf'),
		close_bracket: tinycast('rightHalf'),
		return_or_enter: tinycast('maximize'),
		tab: {
			to: [{ key_code: 'tab', modifiers: ['left_control'] }],
		},
	}),
	// switches the fn keys in vscode
	vsCodeFnSwitch(),
];
