<script lang="ts" setup>
import { useAllDynamicDialogs } from "../use-dialog";
const dialogs = useAllDynamicDialogs();
</script>

<template>
	<component
		v-for="dialog of dialogs"
		:key="dialog.id"
		:is="dialog.component"
		v-bind="dialog.props"
		v-model:open="dialog.open.value"
	/>
</template>
