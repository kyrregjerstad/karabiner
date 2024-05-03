import { complexModifications } from './rules';
import type { KarabinerRule } from './types';
import { norwegianKeyboardMod } from './utils';

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
				simple_modifications: [...norwegianKeyboardMod()],
			},
		],
	};
}

const startTime = Date.now();

await Bun.write('karabiner.json', JSON.stringify(defaultConfig(complexModifications), null, 2));

const endTime = Date.now();

const duration = endTime - startTime;

console.log('Wrote karabiner.json 🥳');
console.log(`Process took ${duration} milliseconds 🚀`);
