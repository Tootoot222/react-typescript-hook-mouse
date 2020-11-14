import babel from '@rollup/plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import typescript from 'typescript';
import rollupTypescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
  input: 'src/useMouse.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'default',
    },
    {
      file: pkg.module,
      format: 'esm',
      exports: 'default',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    eslint({
      throwOnError: true,
      throwOnWarning: true,
    }),
    babel({ babelHelpers: 'bundled' }),
    rollupTypescript({
      typescript,
    }),
  ],
};
