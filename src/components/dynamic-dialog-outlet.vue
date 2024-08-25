<script lang="ts" setup>
import { useAllDialogs } from "../use-dialog";
const dialogs = useAllDialogs();
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
