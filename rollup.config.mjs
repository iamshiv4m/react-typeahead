import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { createRequire } from "module";
import { visualizer } from "rollup-plugin-visualizer";
import terser from "@rollup/plugin-terser";
import cssnano from "cssnano";
import gzip from "rollup-plugin-gzip";

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
        plugins: [
          cssnano({
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
                minifyFontValues: true,
              },
            ],
          }),
        ],
      }),
      terser({
        compress: {
          pure_funcs: ["console.log", "console.info", "console.debug"],
          drop_debugger: true,
          passes: 2,
        },
      }),
      visualizer({
        filename: "bundle-analysis.html",
        gzipSize: true,
        brotliSize: true,
        sourcemap: true,
        open: true,
      }),
      {
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
      gzip({
        filter: /\.(js|css|html|json|ico|svg)$/,
        minSize: 1024,
      }),
    ],
    external: ["react", "react-dom"],
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
