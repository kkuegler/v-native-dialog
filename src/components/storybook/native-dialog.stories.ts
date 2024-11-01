import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import { useArgs } from "@storybook/preview-api";
import NativeDialog from "../native-dialog.vue";

// https://storybook.js.org/docs/writing-stories
const meta = {
	title: "NativeDialog",
	component: NativeDialog,
	tags: ["autodocs"],
	args: {
		// Using `fn` to spy on the event listener args, which will appear in the actions panel once invoked
		// https://storybook.js.org/docs/essentials/actions#action-args
		onResult: fn(),
		onOpened: fn(),
		onClosed: fn(),
		onCancel: fn(),
		open: false,
		nonModal: false,
		preventEscape: false,
		displayDirective: "if",
	},
	argTypes: {
		displayDirective: {
			options: ["if", "show"],
			control: { type: "inline-radio" },
		},
	},
} satisfies Meta<typeof NativeDialog>;

export default meta;

export const Demo: StoryObj<typeof meta> = {
	render(args) {
		const [, updateArgs] = useArgs();
		return {
			template: `
				<NativeDialog v-bind="args" @update:open="updateOpen" v-slot="slotProps">
					<p>dialog content</p>
					<button type="button" @click="slotProps.closeDialog('ok', 123)">OK with result</button>
					<button type="button" @click="slotProps.closeDialog">Close</button>
				</NativeDialog>
				<button type="button" @click="updateOpen(true)">Open Dialog</button>`,
			methods: {
				updateOpen(val: boolean) {
					updateArgs({ open: val });
				},
			},
			components: { NativeDialog },
			setup() {
				return { args };
			},
		};
	},
};
