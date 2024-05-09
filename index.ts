import { complexModifications } from './rules';
import type { KarabinerRule } from './types';
import { internalKeyboard, keychronK2 } from './utils';

function defaultConfig(rules: KarabinerRule[]) {
	return {
		global: {
			show_in_menu_bar: false,
		},
		profiles: [
			{
				name: 'Default',
				complex_modifications: {
					rules,
				},
				devices: [...internalKeyboard(), ...keychronK2()],
			},
		],
	};
}

const outDir = 'karabiner.json';
const startTime = performance.now();
await Bun.write(outDir, JSON.stringify(defaultConfig(complexModifications), null, 2));

const endTime = performance.now();
const duration = endTime - startTime;

console.log(`Wrote ${outDir} - Process took ${duration.toFixed(2)} milliseconds 🚀`);
