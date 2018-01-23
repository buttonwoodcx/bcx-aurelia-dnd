import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    format: 'umd',
    name: 'BcxAureliaDnd',
    file: 'dist/index.js',
    globals: {
      "aurelia-event-aggregator": "AureliaEventAggregator"
    }
  },
  external: ["aurelia-event-aggregator"],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    uglify()
  ]
};
