import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/main.js',
  output: {
    file: 'parser.js',
    format: 'cjs',
  },
  plugins: [json(), terser()],
};
