<script setup lang="ts">
import { nextTick, onBeforeUnmount, PropType, ref, useTemplateRef, watch } from "vue";
import type { ResultPayload } from "../use-dialog";
const open = defineModel<boolean>("open", { default: true });
const props = defineProps({
	nonModal: {
		type: Boolean,
		default: false,
	},
	/**
	 * If true prevents the dialog from being closed using the 'esc' key (or other platform ways of closing dialogs).
	 * Some browsers allow this only a single time, then close anyway.<br>
	 * Use this sparingly, to provide a good user experience.
	 */
	preventEscape: {
		type: Boolean,
		default: false,
	},
	/**
	 * How the dialog shall be shown/hidden. By default uses v-if, i.e. no rendering if hidden, re-rendering on show.<br>
	 * If set to 'show', the rendered dialog is always in the DOM and will be shown/hidden using the 'open' attribute.
	 */
	displayDirective: {
		type: String as PropType<"if" | "show">,
		default: "if",
	},
});
const emit = defineEmits<{
	/**
	 * Triggers when the dialog is shown. Returns HTMLDialogElement
	 */
	(e: "opened", dialog: HTMLDialogElement): void;
	/**
	 * Triggers when the dialog has closed. Returns HTMLDialogElement
	 */
	(e: "closed", dialog: HTMLDialogElement | null): void;
	/**
	 * Emitted when closing the dialog. Contains the close action (e.g. 'ok'/'cancel') and
	 * optionally a result value provided to the <code>closeDialog()</code> slot prop function.
	 */
	(e: "result", payload: ResultPayload): void;
}>();

const dialog = useTemplateRef("dialogRef");
const alreadyEmittedResult = ref(false);
const showDialog = () => {
	const dlg = dialog.value;
	if (!dlg) {
		throw new Error("Dialog element not rendered yet");
	}
	if (props.nonModal) {
		dlg.show();
	} else {
		dlg.showModal();
	}
	emit("opened", dlg);
	alreadyEmittedResult.value = false;
};

function onCancel(e: Event) {
	if (props.preventEscape) {
		e.preventDefault();
	}
}

function onClosed(e: Event) {
	open.value = false;
	emitResult("close", undefined);
	emit("closed", dialog.value);
}

/**
 * Closes the dialog.
 * @param action optional close action to report, e.g. 'ok' or 'cancel' Available through useDialog() or the 'result' event.
 * @param result optional result payload, e.g. data entered in the dialog. Available through useDialog() or the 'result' event.
 */
function closeDialog(action?: string, result?: any) {
	if (action) {
		emitResult(action, result);
	}
	dialog.value?.close();
}

function emitResult(action: string, result: any) {
	if (alreadyEmittedResult.value) {
		return;
	}
	emit("result", {
		action,
		result,
	});
	alreadyEmittedResult.value = true;
}

watch(
	open,
	(isOpen, wasOpen) => {
		if (isOpen) {
			if (props.displayDirective === "if") {
				// wait for re-render and thus the 'dialog' ref being filled
				nextTick(showDialog);
			} else {
				showDialog();
			}
		} else {
			if (wasOpen !== undefined) {
				closeDialog("hide");
			} // else was not rendered before, so don't close it
		}
	},
	{
		immediate: true,
	}
);

onBeforeUnmount(closeDialog);

defineExpose({
	closeDialog,
	openDialog() {
		open.value = true;
	},
});
defineSlots<{
	/**
	 * Dialog content, with a slot prop <code>closeDialog()</code> to close the dialog from inside.<br>
	 * This has two optional parameters that control the result available through <code>useDialog()</code> or the <code>result</code> event:<br>
	 * <code>action</code>: optional close action to report, e.g. 'ok' or 'cancel'<br>
	 * <code>result</code> optional result payload, e.g. data entered in the dialog.
	 */
	default(props: { closeDialog: typeof closeDialog }): any;
}>();
</script>

<template>
	<dialog
		v-if="displayDirective !== 'if' || open"
		class="v-native-dialog"
		ref="dialogRef"
		@close="onClosed"
		@cancel="onCancel"
	>
		<slot v-bind="{ closeDialog }" />
	</dialog>
</template>

<style>
:root {
	--v-native-dialog-bg-color: #fff;
	--v-native-dialog-backdrop: rgba(0, 0, 0, 0.1);
	--v-native-dialog-spacing: 1rem;
}

.v-native-dialog {
	background: var(--v-native-dialog-bg-color);
	padding: var(--v-native-dialog-spacing);
	max-height: min(80vh, 100%);
	max-height: min(80dvb, 100%);
	max-width: min(90vw, 60ch);
}

.v-native-dialog::backdrop {
	background: var(--v-native-dialog-backdrop);
}
</style>
