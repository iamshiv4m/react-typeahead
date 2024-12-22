import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { createRequire } from "module";
import terser from "@rollup/plugin-terser";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
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
        declaration: false,
        sourceMap: false,
      }),
      postcss({
        extract: false,
        minimize: true,
        modules: true,
        namedExports: true,
      }),
      terser({
        compress: {
          pure_funcs: ["console.log", "console.info", "console.debug"],
          drop_debugger: true,
          passes: 2,
        },
      }),
      {
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [
      dts({
        respectExternal: true,
        compilerOptions: {
          baseUrl: ".",
          paths: {
            "*": ["*"],
          },
        },
      }),
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
