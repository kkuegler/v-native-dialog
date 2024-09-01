import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import { useArgs } from "@storybook/preview-api";
import NativeDialog from "../components/native-dialog.vue";

// https://storybook.js.org/docs/writing-stories
const meta = {
	component: NativeDialog,
	// https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	args: {
		// Using `fn` to spy on the event listener args, which will appear in the actions panel once invoked
		// https://storybook.js.org/docs/essentials/actions#action-args
		onResult: fn(),
		onOpened: fn(),
		onClosed: fn(),
		open: false,
		nonModal: false,
		preventEscape: false,
		displayDirective: "if",
	},
} satisfies Meta<typeof NativeDialog>;

export default meta;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf to learn how to use render functions.
 */
export const Demo: StoryObj<typeof meta> = {
	render(args) {
		const [, updateArgs] = useArgs();
		return {
			components: { NativeDialog },
			setup() {
				return { args };
			},
			methods: {
				updateOpen(val: boolean) {
					updateArgs({ open: val });
				},
			},
			template:
				`<NativeDialog v-bind="args" @update:open="updateOpen" v-slot="slotProps">` +
				`  <p>dialog content</p>` +
				`  <button type="button" @click="slotProps.closeDialog('ok', 123)">OK with result</button>` +
				`  <button type="button" @click="slotProps.closeDialog">Close</button>` +
				`</NativeDialog>` +
				`<button type="button" @click="updateOpen(true)">Open Dialog</button>`,
		};
	},
};
