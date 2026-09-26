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
		b: app('Arc'),
		c: app('Zed'),
		m: app('Spotify'),
		t: {
			to: [{ shell_command: 'open -b com.cmuxterm.app' }],
		},
		p: app('1Password'),
		f: app('Finder'),
		s: app('Slack'),
		o: app('Obsidian'),
		n: app('Notion'),
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
		open_bracket: open('raycast://extensions/raycast/window-management/left-half'),
		close_bracket: open('raycast://extensions/raycast/window-management/right-half'),
		return_or_enter: open('raycast://extensions/raycast/window-management/maximize'),
		tab: {
			to: [{ key_code: 'tab', modifiers: ['left_control'] }],
		},
	}),
	// switches the fn keys in vscode
	vsCodeFnSwitch(),
];
