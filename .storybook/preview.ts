import type { Preview } from "@storybook/vue3";
import { themes } from "@storybook/theming";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		darkMode: {
			// https://storybook.js.org/addons/storybook-dark-mode
			current: "dark",
		},
		docs: {
			// https://github.com/storybookjs/storybook/blob/next/code/addons/docs/docs/theming.md#storybook-theming
			theme: themes.dark,
		},
		backgrounds: {
			// https://storybook.js.org/docs/essentials/backgrounds#configuration
			default: "grey",
			values: [
				{
					name: "grey",
					value: "grey",
				},
			],
		},
	},
};

export default preview;
