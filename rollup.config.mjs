import esbuild from 'rollup-plugin-esbuild';
import litCss from 'rollup-plugin-lit-css';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
import postcssUrl from 'postcss-url';
import copy from 'rollup-plugin-copy';

import minifyHtml from 'rollup-plugin-minify-html-literals';
import path from 'path';

export default function createConfig(packageName) {
  const output = {
    exports: 'named',
    name: packageName,
    sourcemap: true,
  };

  const esbuildPlugin = esbuild({
    minify: true,
    tsconfig: './tsconfig.json',
    platform: 'browser',
    treeShaking: true,
    loaders: {
      '.json': 'json',
    },
  });

  const litCssPlugin = litCss({
    include: ['**/*.css'],
    uglify: true,
  });

  // const lessPlugin = less({
  //   insert: true,
  //   include: ['./index.less'],
  //   output: './dist/assets/index.css',
  //   option: {
  //     javascriptEnabled: true,
  //   },
  // });

  const copyPlugin = copy({
    targets: [
      // Need to copy the files over for usage
      { src: 'src/assets/fonts', dest: 'dist/assets' },
      { src: 'src/sandbox', dest: 'dist' },
    ],
  });

  const postcssPlugin = postcss({
    minimize: true,
    modules: false,
    autoModules: true,
    extensions: ['.css', '.less'],
    use: {
      sass: null,
      stylus: null,
    },
    extract: path.resolve('dist/assets/index.css'),
    plugins: [
      postcssUrl({
        url: 'inline', // enable inline assets using base64 encoding
        maxSize: 10, // maximum file size to inline (in kilobytes)
        fallback: 'copy', // fallback method to use if max size is exceeded
      }),
    ],
  });

  const urlPlugin = url();

  return [
    {
      input: './index.ts',
      plugins: [litCssPlugin, minifyHtml, esbuildPlugin, postcssPlugin, urlPlugin, copyPlugin],
      output: [{ file: './dist/index.js', format: 'es', ...output }],
    },
  ];
}
