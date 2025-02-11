import type { To, KeyCode, Manipulator, KarabinerRule, SimpleModification, ModifierKeyCode } from './types';

/**
 * Custom way to describe a command in a layer
 */
export type LayerCommand = {
	to: To[];
	description?: string;
};

type HyperKeySubLayer = {
	// The ? is necessary, otherwise we'd have to define something for _every_ key code
	[key_code in KeyCode]?: LayerCommand;
};

export const hyper = ['left_control', 'left_option', 'left_shift', 'left_command'] satisfies ModifierKeyCode[];

/**
 * Create a Hyper Key sublayer, where every command is prefixed with a key
 * e.g. Hyper + O ("Open") is the "open applications" layer, I can press
 * e.g. Hyper + O + G ("Google Chrome") to open Chrome
 */
export function createHyperSubLayer(
	sublayer_key: KeyCode,
	commands: HyperKeySubLayer,
	allSubLayerVariables: string[]
): Manipulator[] {
	const subLayerVariableName = generateSubLayerVariableName(sublayer_key);

	return [
		// When Hyper + sublayer_key is pressed, set the variable to 1; on key_up, set it to 0 again
		{
			description: `Toggle Hyper sublayer ${sublayer_key}`,
			type: 'basic',
			from: {
				key_code: sublayer_key,
				modifiers: {
					optional: ['any'],
				},
			},
			to_after_key_up: [
				{
					set_variable: {
						name: subLayerVariableName,
						// The default value of a variable is 0: https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/conditions/variable/
						// That means by using 0 and 1 we can filter for "0" in the conditions below and it'll work on startup
						value: 0,
					},
				},
			],
			to: [
				{
					set_variable: {
						name: subLayerVariableName,
						value: 1,
					},
				},
			],
			// This enables us to press other sublayer keys in the current sublayer
			// (e.g. Hyper + O > M even though Hyper + M is also a sublayer)
			// basically, only trigger a sublayer if no other sublayer is active
			conditions: [
				...allSubLayerVariables
					.filter((subLayerVariable) => subLayerVariable !== subLayerVariableName)
					.map((subLayerVariable) => ({
						type: 'variable_if' as const,
						name: subLayerVariable,
						value: 0,
					})),
				{
					type: 'variable_if',
					name: 'hyper',
					value: 1,
				},
			],
		},
		// Define the individual commands that are meant to trigger in the sublayer
		...(Object.keys(commands) as (keyof typeof commands)[]).map(
			(command_key): Manipulator => ({
				...commands[command_key],
				type: 'basic' as const,
				from: {
					key_code: command_key,
					modifiers: {
						optional: ['any'],
					},
				},
				// Only trigger this command if the variable is 1 (i.e., if Hyper + sublayer is held)
				conditions: [
					{
						type: 'variable_if',
						name: subLayerVariableName,
						value: 1,
					},
				],
			})
		),
	];
}

/**
 * Create all hyper sublayers. This needs to be a single function, as well need to
 * have all the hyper variable names in order to filter them and make sure only one
 * activates at a time
 */
export function createHyperSubLayers(subLayers: {
	[key_code in KeyCode]?: HyperKeySubLayer | LayerCommand;
}): KarabinerRule[] {
	const allSubLayerVariables = (Object.keys(subLayers) as (keyof typeof subLayers)[]).map((sublayer_key) =>
		generateSubLayerVariableName(sublayer_key)
	);

	return Object.entries(subLayers).map(([key, value]) =>
		'to' in value
			? {
					description: `Hyper Key + ${key}`,
					manipulators: [
						{
							...value,
							type: 'basic' as const,
							from: {
								key_code: key as KeyCode,
								modifiers: {
									optional: ['any'],
								},
							},
							conditions: [
								{
									type: 'variable_if',
									name: 'hyper',
									value: 1,
								},
								...allSubLayerVariables.map((subLayerVariable) => ({
									type: 'variable_if' as const,
									name: subLayerVariable,
									value: 0,
								})),
							],
						},
					],
				}
			: {
					description: `Hyper Key sublayer "${key}"`,
					manipulators: createHyperSubLayer(key as KeyCode, value, allSubLayerVariables),
				}
	);
}

function generateSubLayerVariableName(key: KeyCode) {
	return `hyper_sublayer_${key}`;
}

/**
 * Shortcut for "open" shell command
 */
export function open(what: string): LayerCommand {
	return {
		to: [
			{
				shell_command: `open -g ${what}`,
			},
		],
		description: `Open ${what}`,
	};
}

/**
 * Shortcut for "Open an app" command (of which there are a bunch)
 */
export function app(name: string): LayerCommand {
	return open(`-a '${name}.app'`);
}

function switchFnKey(from: KeyCode, to: To): Manipulator[] {
	const defaultBehavior = {
		conditions: [
			{
				bundle_identifiers: ['com.todesktop.230313mzl4w4u92'],
				type: 'frontmost_application_if',
			},
		],
		from: {
			key_code: from,
			modifiers: {
				optional: ['any'],
			},
		},
		to: [
			{
				key_code: from,
			},
		],
		type: 'basic',
	} satisfies Manipulator;

	const modifiedBehavior = {
		...defaultBehavior,
		from: {
			key_code: from,
			modifiers: {
				mandatory: ['fn'],
				optional: ['any'],
			},
		},
		to: [to],
	} satisfies Manipulator;

	return [defaultBehavior, modifiedBehavior];
}

export function vsCodeFnSwitch(): KarabinerRule {
	return {
		description: 'Use F1-F12 as standard function keys in VSCode and Cursor, with fn for media keys.',
		manipulators: [
			...switchFnKey('f1', {
				consumer_key_code: 'display_brightness_decrement',
			}),
			...switchFnKey('f2', {
				consumer_key_code: 'display_brightness_increment',
			}),
			...switchFnKey('f3', {
				apple_vendor_keyboard_key_code: 'mission_control',
			}),
			...switchFnKey('f4', { apple_vendor_keyboard_key_code: 'spotlight' }),
			...switchFnKey('f5', { consumer_key_code: 'dictation' }),
			...switchFnKey('f7', { consumer_key_code: 'rewind' }),
			...switchFnKey('f8', { consumer_key_code: 'play_or_pause' }),
			...switchFnKey('f9', { consumer_key_code: 'fast_forward' }),
			...switchFnKey('f10', { consumer_key_code: 'mute' }),
			...switchFnKey('f11', { consumer_key_code: 'volume_decrement' }),
			...switchFnKey('f12', { consumer_key_code: 'volume_increment' }),
		],
	};
}

const switchKey = (from: KeyCode, to: KeyCode): SimpleModification => ({
	from: {
		key_code: from,
	},
	to: [
		{
			key_code: to,
		},
	],
});

const swapKeys = (from: KeyCode, to: KeyCode): SimpleModification[] => [switchKey(from, to), switchKey(to, from)];

export const norwegianKeyboardMod = () => [...swapKeys('grave_accent_and_tilde', 'non_us_backslash')];
export const keychronK2Mod = () => [...swapKeys('grave_accent_and_tilde', 'non_us_backslash')];

export const internalKeyboard = () => [
	{
		identifiers: {
			is_game_pad: false,
			is_keyboard: true,
			is_pointing_device: false,
			product_id: 835,
			vendor_id: 1452,
		},
		simple_modifications: [...norwegianKeyboardMod()],
	},
];

const keychronK2Identifiers = {
	is_game_pad: false,
	is_keyboard: true,
	is_pointing_device: false,
	product_id: 591,
	vendor_id: 1452,
};

export const keychronK2 = () => [
	{
		identifiers: keychronK2Identifiers,
	},
];

export function fnKeyRemapping(): KarabinerRule[] {
	return [
		{
			description: 'Fn key remapping',
			manipulators: [
				{
					type: 'basic',
					description: 'Fn -> Right Option',
					from: {
						apple_vendor_top_case_key_code: 'keyboard_fn',
					},
					to: [
						{
							key_code: 'right_option',
						},
					],
				},
			],
		},
		{
			description: 'Right Control -> Fn',
			manipulators: [
				{
					type: 'basic',
					from: {
						key_code: 'right_control',
					},
					to: [
						{
							apple_vendor_top_case_key_code: 'keyboard_fn',
						},
					],
				},
			],
		},
	];
}
