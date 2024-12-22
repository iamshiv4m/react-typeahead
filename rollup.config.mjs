import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { createRequire } from "module";
import { visualizer } from "rollup-plugin-visualizer";
import terser from "@rollup/plugin-terser";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/cjs/index.js",
        format: "cjs",
        sourcemap: false,
        exports: "named",
      },
      {
        file: "dist/esm/index.js",
        format: "esm",
        sourcemap: false,
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        extensions: [".ts", ".tsx"],
      }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/*.test.tsx", "**/*.test.ts", "examples/**/*"],
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            sourceMap: false,
          },
        },
      }),
      postcss({
        extract: false,
        minimize: true,
        modules: true,
        namedExports: true,
      }),
      terser(),
      visualizer({
        filename: "bundle-analysis.html",
        open: true,
      }),
    ],
    external: ["react", "react-dom"],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [
      dts(),
      {
        name: "ignore-css-imports",
        transform(code, id) {
          if (id.endsWith(".css")) {
            return {
              code: 'export default "";',
              map: { mappings: "" },
            };
          }
        },
      },
    ],
  },
];
