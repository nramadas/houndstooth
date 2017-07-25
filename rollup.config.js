import typescript from 'rollup-plugin-typescript2';
import inject from 'rollup-plugin-inject';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: './src/index.tsx',
  moduleName: 'houndstooth',
  exports: 'named',
  globals: {
    react: 'React',
    'prop-types': 'PropTypes',
  },
  sourceMap: true,
  plugins: [
    typescript({
      rollupCommonJSResolveHack: true,
    }),
    inject({
      stylis: 'stylis',
    }),
    resolve(),
    commonjs(),
  ],
  external: [
    'react',
    'prop-types',
  ],
  dest: './index.js',
  format: 'umd',
}
