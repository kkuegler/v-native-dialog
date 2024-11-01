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

<script setup lang="ts">
import NativeDialog from "../native-dialog.vue";
import { ref } from "vue";

defineProps<{ question: string }>();
const number = ref(42);
</script>
