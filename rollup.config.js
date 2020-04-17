import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from "rollup-plugin-terser";

export default {
  input: 'src/dnd-service.js',
  output: {
    format: 'cjs',
    file: 'dist/index.js'
  },
  external: ["aurelia-event-aggregator"],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    terser()
  ]
};
