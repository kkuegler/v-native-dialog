import type { Meta, StoryObj } from "@storybook/vue3";
import DynamicDialogOutlet from "../dynamic-dialog-outlet.vue";
import DemoDialog from "./demo-dialog.vue";
import { useDialog } from "../../use-dialog";

// https://storybook.js.org/docs/writing-stories
const meta = {
	title: "DynamicDialogOutlet",
	component: DynamicDialogOutlet,
	parameters: {
		controls: {
			disable: true,
		},
		actions: {
			disable: true,
		},
	},
} satisfies Meta<typeof DynamicDialogOutlet>;

export default meta;
export const Demo: StoryObj<typeof meta> = {
	render() {
		return {
			template: `
				<button type="button" @click="openDialog">Open dynamic dialog</button>
				<DynamicDialogOutlet/>`,
			methods: {
				async openDialog() {
					const { close, resultPromise } = useDialog(DemoDialog);
					setTimeout(() => {
						close();
					}, 10000);
					const result = await resultPromise;
					console.log("dialog result: ", result);
				},
			},
			components: { DynamicDialogOutlet },
		};
	},
};
