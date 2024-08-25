import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		// target: 'esnext',
		outDir: "dist",
		lib: {
			formats: ["es"],
			entry: resolve(__dirname, "src/index.ts"),
			name: "v-native-dialog",
			fileName: (format) => `vue-native-dialog.js`,
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["vue"],
		},
	},
});
