# v-native-dialog <a href="https://www.npmjs.com/package/v-native-dialog"><img src="https://badgen.net/npm/v/v-native-dialog"></a> <img src="https://badgen.net/npm/types/v-native-dialog">

A Vue 3 component using the [native `<dialog>` element](https://developer.mozilla.org/de/docs/Web/HTML/Element/dialog). This e.g. provides more helpful events than `<dialog/>` itself.

This library also allows to imperatively show dialogs using a `useDialog()` composition function and (optionally) have dialogs "return" result values.

## Docs

See the interactive [StoryBook page](https://kkuegler.github.io/v-native-dialog/) and the documentation further down on this page.

## Install

```
npm install v-native-dialog
pnpm add v-native-dialog
```

## Usage

### As a child Vue component

```vue
<script type="setup">
import { ref } from 'vue';
import { NativeDialog } from 'v-native-dialog';
const open = ref(true);
</script>
<template>
	<!-- ... other content ... -->
	<NativeDialog v-model:open="open" v-slot="{ closeDialog }">
		<p>The dialog content</p>
		<button type="button" @click="closeDialog('ok')">OK</button>
		<button type="button" @click="closeDialog('cancel')">Cancel</button>
	</NativeDialog>
</template>
<style>
@import "v-native-dialog/style.css";
</style>
```

### As a dynamic dialog

You can render dialogs on the fly using `useDialog()` without including the dialog content in a parent Vue component. This allows to extract reusable dialogs.

Prerequisite: Render `<DynamicDialogOutlet/>` provided by this library somewhere in you app. This renders all dynamic dialogs.

```ts
// some-file.ts
import NumberDialog from "./number-dialog.vue";
async function askUser(question: string): Promise<number> {
	const { resultPromise } = useDialog(NumberDialog, { props: { question } });
	const { action, result } = await resultPromise;
	if (action == "ok") {
		return result;
	} else {
		// action is 'close' or 'cancel'
		return -1;
	}
	// alternatively: return result ?? -1;
}
```

```vue
<!-- number-dialog.vue -->
<script setup lang="ts">
import NativeDialog from "../native-dialog.vue";
import { ref } from "vue";

defineProps<{ question: string }>();
const number = ref(42);
</script>

<template>
	<NativeDialog v-slot="{ closeDialog }">
		<p>{{ question }}</p>
		<p>
			<input type="number" v-model="number" />
		</p>
		<button type="button" @click="closeDialog('ok', number)">OK</button>
		<button type="button" @click="closeDialog('cancel')">Cancel</button>
	</NativeDialog>
</template>
```

## Docs: `NativeDialog` component

### Props

#### `nonModal`

- **Type:** `boolean`
- **Default:** `false`, i.e. modal
- **Description:** If `true`, the dialog will [not be modal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/show).

#### `closedby`

- **Type:** `string` (`"any"`, `"closerequest"`, `"none"`)
- **Default:** not set
- **Description:** The [native 'closedby' attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby), specifying how the dialog can be closed by the user. This currently (2025-12) has limited browser support. \
  For `"none"` we also use a fallback which is Baseline Widely available: We call `preventDefault()` on the native [`cancel` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event).

#### `preventEscape` (deprecated, use `closedby="none"` instead)

- **Type:** `boolean`
- **Default:** `false`
- **Description:** If `true`, sets `closedby="none"` if that is not explicitly set. This prop is deprecated. Instead, use the `closedby` prop directly.

#### `displayDirective`

- **Type:** `string` (`"if"` | `"show"`)
- **Default:** `"if"`
- **Description:** How the dialog shall be shown/hidden. By default, uses `v-if`, i.e., no rendering if hidden, re-rendering on show. If set to `'show'`, the rendered dialog is always in the DOM and will be shown/hidden using the `'open'` attribute.

### Default Slot

- **Slot Props:**
  - `closeDialog`: Function to close the dialog and optionally provide the `action` and `result` for the `result` event.

### Events

#### `opened`

- **Description:** Triggers when the dialog is shown.
- **Payload:**
  - `dialog`: `HTMLDialogElement`

#### `closed`

- **Description:** Triggers when the dialog has closed.
- **Payload:**
  - `dialog`: `HTMLDialogElement | null`

#### `result`

- **Description:** Triggers when a result is emitted from the dialog (using `closeDialog()`).
- **Payload:**
  - `payload`: `{action: string, result?: any}` aka `ResultPayload`
    - `action` is `'close'` by default, but can be any string you specify in the `closeDialog(action)` call, e.g. `'ok'` or `'cancel'`.

      If closed via `v-model:open` the action is `'hide'`.

    - `result` is `undefined` by default. You can specify the value using the `closeDialog(action, result)` call. Use this for the "return value" of the dialog.

### CSS custom properties

Can be adapted using CSS.

#### `--v-native-dialog-bg-color`

- **Default:** `#fff`
- **Description:** Background color for the dialog content.

#### `--v-native-dialog-backdrop`

- **Default:** `rgba(0, 0, 0, 0.1)`
- **Description:** Color of the backdrop behind the dialog overlaying the page content.

#### `--v-native-dialog-spacing`

- **Default:** `1rem`
- **Description:** Padding for the dialog content.

## Docs: `useDialog` composition function

`useDialog()` creates (and by default opens) a dialog dynamically by adding it to the dialog list. This dialog list is rendered using the `DynamicDialogOutlet` component.

See [Usage](#usage) above.

### Parameters

- `component` (`Component`): A Vue component that uses the `NativeDialog` in its template.
- `options` (`Object`, optional):
  - `initiallyOpen` (`Boolean`, default: `true`): Determines if the dialog should be open initially.
  - `removeAfterClose` (`Boolean`, default: `true`): Determines if the dialog should be removed from the dynamic list after it is closed. If you want to be able to re-open the dialog, set this to `false`.
  - `props` (Record<string, any>, default: `{}`): Props to pass to the dynamic dialog `component`.
  - `dynamicDialogs` (Ref<DialogInfo[]>, default: built-in global list): The list of dynamic dialogs.

### Returns

- `result` (`Ref<ResultPayload<R> | undefined>`): A `ref` holding the result payload of the dialog.
- `resultPromise` (`Promise<ResultPayload<R>>`): A `Promise` that resolves with the result payload (close action and result) when the dialog is closed. Mostly helpful for one-shot dialogs.
- `show` (`Function`): Opens the dialog.
- `close` (`Function`): Closes the dialog.
- `destroy` (`Function`): Closes the dialog and removes it from the dialog list. The dialog cannot be re-opened after this.

## Docs: `DynamicDialogOutlet` component

This component should be rendered somewhere in your app. This is required for dialogs created dynamically using `useDialog()` to be shown.

## Additional resources

### Inspirations

- Component [`vue3-native-dialog`](https://www.npmjs.com/package/vue3-native-dialog)
- Article ['Building a dialog component'](https://web.dev/articles/building/a-dialog-component)

### Misc

- [Remaining caveats](https://a11y-dialog.netlify.app/further-reading/dialog-element/#remaining-caveats) of the `<dialog>` element

## Contribute

Run the interactive demo, which works as a nice testbed for changes.

```
npm run storybook
```
