<template>
	<NativeDialog v-slot="{ closeDialog }">
		<div>Your dialog content</div>
		<button type="button" @click="closeDialog()">Close Dialog (or wait 10s)</button>
	</NativeDialog>
</template>

<script setup lang="ts">
import NativeDialog from "../native-dialog.vue";
</script>
