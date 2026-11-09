import type { KeyCode, ModifierKeyCode } from './types';
import type { LayerCommand } from './utils';
import { hyper } from './utils';

// Native commands have no URL routes in Tinycast 0.12.1. Karabiner emits
// these shortcuts; `bun run tinycast.ts` registers them with Tinycast.
const bindings = {
	ai: ['command:ai-chat-window', 'a', 0, hyper],
	bluetooth: ['systemAction.toggle-bluetooth', 'b', 11, hyper],
	camera: ['command:open-camera', 'c', 8, hyper],
	emoji: ['command:search-emoji', 'e', 14, hyper],
	clipboard: ['command:clipboard-history', 'v', 9, ['left_option']],
	notifications: ['systemAction.dismiss-notifications', 'n', 45, hyper],
	appearance: ['systemAction.toggle-system-appearance', 't', 17, hyper],
	leftHalf: ['windowCommand.left-half', 'open_bracket', 33, hyper],
	rightHalf: ['windowCommand.right-half', 'close_bracket', 30, hyper],
	maximize: ['windowCommand.maximize', 'return_or_enter', 36, hyper],
} satisfies Record<string, [string, KeyCode, number, ModifierKeyCode[]]>;

export function tinycast(command: keyof typeof bindings): LayerCommand {
	const [, key_code, , modifiers] = bindings[command];
	return { description: `Tinycast: ${command}`, to: [{ key_code, modifiers }] };
}

if (import.meta.main) {
	const domain = 'com.tinycast.app';
	const current = Bun.spawnSync(['defaults', 'export', domain, '-']);
	if (current.exitCode !== 0) throw new Error('Cannot read Tinycast preferences');
	const converted = Bun.spawnSync(['python3', '-c', 'import sys,plistlib,json; p=plistlib.loads(sys.stdin.buffer.read()); print(json.dumps({k:v for k,v in p.items() if k.startswith("hotkey.") and isinstance(v,str)}))'], { stdin: current.stdout });
	if (converted.exitCode !== 0) throw new Error('Cannot decode Tinycast preferences');
	const preferences = JSON.parse(converted.stdout.toString());
	const weights: Record<string, number> = { left_command: 256, left_shift: 512, left_option: 2048, left_control: 4096 };
	const changes: [string, string][] = [];
	for (const [action, , carbonKeyCode, modifiers] of Object.values(bindings)) {
		const carbonModifiers = modifiers.reduce((sum, modifier) => sum + weights[modifier], 0);
		const shortcut = { carbonKeyCode, carbonModifiers };
		for (const [key, value] of Object.entries(preferences)) {
			if (!key.startsWith('hotkey.') || typeof value !== 'string') continue;
			const existing = JSON.parse(value)?.combo?._0;
			if (key !== `hotkey.${action}` && existing?.carbonKeyCode === carbonKeyCode && existing?.carbonModifiers === carbonModifiers)
				throw new Error(`Shortcut conflict with ${key}`);
		}
		const key = `hotkey.${action}`;
		if (preferences[key]) {
			const existing = JSON.parse(preferences[key])?.combo?._0;
			if (existing?.carbonKeyCode !== carbonKeyCode || existing?.carbonModifiers !== carbonModifiers)
				throw new Error(`Existing binding differs for ${key}; reconcile it before setup`);
			continue;
		}
		changes.push([key, JSON.stringify({ combo: { _0: shortcut } })]);
	}
	for (const [key, value] of changes) {
		if (Bun.spawnSync(['defaults', 'write', domain, key, '-string', value]).exitCode !== 0)
			throw new Error(`Failed to register ${key}`);
	}
	console.log(`Registered ${changes.length} Tinycast shortcuts. Restart Tinycast to load them.`);
}
