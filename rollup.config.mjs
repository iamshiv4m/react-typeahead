import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { createRequire } from "module";
import terser from "@rollup/plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";

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
        hoistTransitiveImports: false,
        compact: true,
        generatedCode: {
          preset: "es2015",
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true,
        },
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        extensions: [".ts", ".tsx"],
        preferBuiltins: true,
        mainFields: ["module", "main"],
      }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/*.test.tsx", "**/*.test.ts", "examples/**/*"],
        declaration: false,
        sourceMap: false,
        importHelpers: false,
        noEmitHelpers: false,
        inlineSources: false,
        inlineSourceMap: false,
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
          module: true,
          toplevel: true,
          unsafe_arrows: true,
          dead_code: true,
        },
        mangle: {
          module: true,
          toplevel: true,
        },
        format: {
          comments: false,
          ecma: 2015,
        },
      }),
      {
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
          preset: "smallest",
        },
      },
      visualizer({
        filename: "bundle-analysis.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: "treemap",
      }),
    ],
    external: ["react", "react-dom", "tslib"],
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
