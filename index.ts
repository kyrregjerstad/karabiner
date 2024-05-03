import { rules } from './rules';
import type { KarabinerRule } from './types';

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
			},
		],
	};
}

const startTime = Date.now();

await Bun.write('karabiner.json', JSON.stringify(defaultConfig(rules), null, 2));

// End timing
const endTime = Date.now();

// Calculate duration
const duration = endTime - startTime;

console.log('Wrote karabiner.json 🥳');
console.log(`Process took ${duration} milliseconds 🚀`);
