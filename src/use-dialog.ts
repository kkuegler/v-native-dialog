import { inject, InjectionKey, Ref, ref, shallowRef } from "vue";

export function useDialog<R = any>(
	component: any,
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
	component: any;
	props?: Record<string, any>;
}
const dialogs = shallowRef<DialogInfo[]>([]);
export const injectionKey = Symbol("dynamic-dialogs") as InjectionKey<typeof dialogs>;
export function useAllDynamicDialogs() {
	return inject(injectionKey, dialogs);
}
