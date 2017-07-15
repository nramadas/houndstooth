import typescript from 'rollup-plugin-typescript2';

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
    typescript(),
  ],
  external: [
    'react',
    'prop-types',
  ],
  dest: './index.js',
  format: 'cjs',
}
