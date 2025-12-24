import type { Preview } from "@storybook/vue3-vite";
import { themes } from "storybook/theming";

const preview: Preview = {
	parameters: {
		darkMode: {
			// https://github.com/vuelessjs/storybook-dark-mode
			current: "dark",
		},
		docs: {
			// https://github.com/storybookjs/storybook/blob/next/code/addons/docs/docs/theming.md#storybook-theming
			theme: themes.dark,
			codePanel: true,
		},
		backgrounds: {
			options: {
				grey: {
					name: "grey",
					value: "grey",
				},
			},
		},
	},

	initialGlobals: {
		backgrounds: {
			value: "grey",
		},
	},
};

export default preview;
