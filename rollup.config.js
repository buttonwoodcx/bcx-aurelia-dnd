import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'BcxAureliaDnd',
  dest: 'dist/index.js',
  external: ["aurelia-event-aggregator"],
  globals: {
    "aurelia-event-aggregator": "AureliaEventAggregator"
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    uglify()
  ]
};
