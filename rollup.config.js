import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import typescript from 'typescript';
import rollupTypescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
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
    babel(),
    rollupTypescript({
      typescript,
    }),
  ],
};
