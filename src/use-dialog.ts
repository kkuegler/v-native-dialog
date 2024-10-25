import type { InjectionKey, Ref, Component } from "vue";
import { inject, ref, shallowRef } from "vue";

/**
 * Creates/opens a dialog dynamically by putting it on the dialog list. That can be rendered using the DynamicDialogOutlet component.
 * @param component a Vue component using the NativeDialog in its template
 * @param options various options, including props to pass to the dynamic dialog
 */
export function useDialog<R = any>(
	component: Component,
	{
		initiallyOpen = true,
		removeAfterClose = true,
		props = {} as Record<string, any>,
		dynamicDialogs = dialogs,
	} = {}
) {
	const open = ref(initiallyOpen);
	const result = ref<ResultPayload<R>>();
	// random string, see https://stackoverflow.com/a/8084248/3394495
	const id = (Math.random() + 1).toString(36).substring(7);

	let resolve: (p: ResultPayload<R>) => void;
	const resultPromise = new Promise<ResultPayload<R>>((r) => {
		resolve = r;
	});

	const newDialog: DialogInfo = {
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

	dynamicDialogs.value = [...dynamicDialogs.value, newDialog];

	function destroy() {
		dynamicDialogs.value = dynamicDialogs.value.filter((it) => it.id !== id);
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

export interface ResultPayload<R = any> {
	action: "close" | string;
	result: R;
}

interface DialogInfo {
	id: string;
	open: Ref<boolean>;
	component: Component;
	props?: Record<string, any>;
}
// the global default list of dynamic dialogs
const dialogs = shallowRef<DialogInfo[]>([]);
/**
 * Injection key for the active dialogs. Can be provide()-ed by the application.
 * This is used by the DynamicDialogOutlet component.<br>
 * Without a provided value falls back to a global dialog list.
 */
export const injectionKey = Symbol("dynamic-dialogs") as InjectionKey<typeof dialogs>;

/**
 * Gets the injected list of currently active dialogs, falling back to a global list.
 * @see injectionKey (another export) the key used for injection
 */
export function useAllDynamicDialogs() {
	return inject(injectionKey, dialogs);
}
