import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		outDir: "dist",
		lib: {
			formats: ["es"],
			entry: resolve(__dirname, "src/index.ts"),
			name: "v-native-dialog",
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["vue"],
		},
	},
});
