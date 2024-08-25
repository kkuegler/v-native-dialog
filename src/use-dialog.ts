import { Ref, ref, shallowRef } from "vue";

export function useDialog(
	component: any,
	{
		initialOpen: initiallyOpen = true,
		removeAfterClose = true,
		props = {} as Record<string, any>,
	} = {},
) {
	const open = ref(initiallyOpen);
	const result = ref();
	// random string, see https://stackoverflow.com/a/8084248/3394495
	const id = (Math.random() + 1).toString(36).substring(7);

	const { promise: resultPromise, resolve } = Promise.withResolvers();

	const newDialog = {
		component,
		id,
		open,
		props: {
			...props,
			onResult(res: ResultPayload) {
				resolve(res);
				result.value = res;
				props.onResult?.(res);
			},
			onClosed() {
				if (removeAfterClose) {
					destroy();
				}
				props.onClosed?.();
			},
		},
	};

	dialogs.value = [...dialogs.value, newDialog];

	function destroy() {
		dialogs.value = dialogs.value.filter((it) => it.id !== id);
	}

	return {
		result,
		resultPromise,
		show() {
			open.value = true;
		},
		close() {
			open.value = false;
		},
		destroy,
	};
}

export interface ResultPayload {
	action: "cancel" | "close" | string;
	result: any;
}

interface DialogInfo {
	id: string;
	open: Ref<boolean>;
	component: any;
	props?: Record<string, any>;
}
const dialogs = shallowRef<DialogInfo[]>([]);
export function useAllDialogs() {
	return dialogs;
}
