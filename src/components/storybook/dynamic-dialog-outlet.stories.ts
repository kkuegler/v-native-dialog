import type { Meta, StoryObj } from "@storybook/vue3";
import DynamicDialogOutlet from "../dynamic-dialog-outlet.vue";
import { useDialog } from "../../use-dialog";
import DemoDialog from "./demo-dialog.vue";
import NumberDialog from "./demo-number-dialog.vue";

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

export const NumberDemo: StoryObj<typeof meta> = {
	render() {
		return {
			template: `
				<button type="button" @click="openDialog">Open number input dialog</button>
				<DynamicDialogOutlet/>`,
			methods: {
				async openDialog() {
					const result = await this.askUser("What is your favorite number?");
					alert("User choice: " + result);
				},
				async askUser(question: string): Promise<number> {
					const { resultPromise } = useDialog(NumberDialog, { props: { question } });
					const { action, result } = await resultPromise;
					if (action == "ok") {
						return result;
					} else {
						// action is 'close' or 'cancel'
						return -1;
					}
				},
			},
			components: { DynamicDialogOutlet },
		};
	},
};

export const NumberDemoInline: StoryObj<typeof meta> = {
	render() {
		return {
			template: `
				<button type="button" @click="show">Open number input dialog</button>
				<p>Result is {{JSON.stringify(result)}}.</p>
				<DynamicDialogOutlet/>`,
			setup() {
				const { result, show } = useDialog(NumberDialog, {
					initiallyOpen: false,
					removeAfterClose: false,
					props: { question: "What is your favorite number?" },
				});
				return {
					result,
					show,
				};
			},
			components: { DynamicDialogOutlet },
		};
	},
};
