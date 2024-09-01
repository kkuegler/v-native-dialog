import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
	framework: {
		name: "@storybook/vue3-vite",
		options: {
			docgen: "vue-component-meta",
		},
	},
	core: {
		disableTelemetry: true,
	},
};
export default config;
