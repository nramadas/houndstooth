import typescript from 'rollup-plugin-typescript2';

export default {
  entry: './src/index.tsx',
  moduleName: 'houndstooth',
  plugins: [
    typescript(),
  ],
  external: [
    'react',
  ],
  dest: './index.js',
  format: 'es',
}
