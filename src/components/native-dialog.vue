<script setup lang="ts">
import { nextTick, onBeforeUnmount, PropType, ref, watch } from "vue";
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
	(e: "opened", dialog: HTMLDialogElement | null): void;
	/**
	 * Triggers when the dialog has closed. Returns HTMLDialogElement
	 */
	(e: "closed", dialog: HTMLDialogElement | null): void;
	(e: "result", payload: ResultPayload): void;
}>();

const dialog = ref<HTMLDialogElement | null>(null);
const alreadyEmittedResult = ref<boolean>(false);
const showDialog = () => {
	if (props.nonModal) {
		dialog.value?.show();
	} else {
		dialog.value?.showModal();
	}
	emit("opened", dialog.value);
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
	(isOpen: boolean) => {
		if (isOpen) {
			if (props.displayDirective === "if") {
				// wait for re-render and thus the 'dialog' ref being filled
				nextTick(showDialog);
			} else {
				showDialog();
			}
		} else {
			closeDialog();
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
	default(props: { closeDialog: typeof closeDialog }): any;
}>();
</script>

<template>
	<dialog
		v-if="displayDirective !== 'if' || open"
		class="v-native-dialog"
		ref="dialog"
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
	padding: var(--v-native-dialog-spacing);
	max-height: min(80vh, 100%);
	max-height: min(80dvb, 100%);
	max-width: min(90vw, 60ch);
}
.v-native-dialog:where([open]) {
	background: var(--v-native-dialog-bg-color);
}

.v-native-dialog::backdrop {
	background: var(--v-native-dialog-backdrop);
}
</style>
