# v-native-dialog

A Vue 3 component using the [native `<dialog>` element](https://developer.mozilla.org/de/docs/Web/HTML/Element/dialog).

## Docs

tbd

## Install

```
npm install v-native-dialog
```

## Usage

As a Vue component:

```vue
<script type="setup">
import { ref } from 'vue';
import { NativeDialog } from 'v-native-dialog';
const open = ref(true);
</script>
<template>
	<NativeDialog v-model:open="open" v-slot="{ closeWithResult }">
		<p>The dialog content</p>
		<button type="button" @click="closeWithResult('ok', 42)">OK</button>
		<button type="button" @click="closeWithResult('cancel')">Cancel</button>
	</NativeDialog>
</template>
<style>
@import "v-native-dialog/style.css";
</style>
```

## Customization

tbd

### CSS custom properties

### Component Props

## Additional resources

### Inspirations

- Component [`vue3-native-dialog`](https://www.npmjs.com/package/vue3-native-dialog)
- Article ['Building a dialog component'](https://web.dev/articles/building/a-dialog-component)

### Misc

- [Remaining caveats](https://a11y-dialog.netlify.app/further-reading/dialog-element/#remaining-caveats) of the `<dialog>` element

## Contribute

### Build and Test

```
npm run build
```