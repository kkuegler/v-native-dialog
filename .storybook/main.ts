import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@vueless/storybook-dark-mode", "@storybook/addon-docs"],
	framework: {
		name: "@storybook/vue3-vite",
		options: {
			docgen: "vue-component-meta",
		},
	},
	core: {
		disableTelemetry: true,
	},
	features: {
		interactions: false,
	},
};
export default config;
