const typescript = require('rollup-plugin-typescript2')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const externalGlobals = require('rollup-plugin-external-globals')
const injectProcessEnv = require('rollup-plugin-inject-process-env')
const { terser } = require('rollup-plugin-terser')
const { getSubPackageNames } = require('./utils')

/**
 * 拿到packages/any/package.json 的name
 * @type {string[]} packagesNames
 * */
const packagesNames = getSubPackageNames()

const presets = () => {
  const externals = {}
  return [
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          module: 'ESNext',
          declarationDir: './dist/',
        },
      },
    }),
    nodeResolve({
      extensions: ['ts', 'tsx']
    }),
    commonjs(),
    externalGlobals(externals, {
      exclude: ['**/*.{less,sass,scss}'],
    }),
  ]
}

/**
 * @param {string} filename 打包出来的文件名
 * @param {string} targetName 包名
 * @param {any[]} plugins 其他插件
 * */
module.exports = ({ filename, targetName, plugins = [], input = 'src/index.ts' }) => {
  const _packagesNames = packagesNames.filter(n => n !== targetName)
  const common = {
    input,
    external: [
      'react',
      'react-dom',
      'react-is',
      'antd',
      '@ant-design/icons',
      'react-router',
      'react-router-dom',
      '@formily/reactive-react',
      '@formily/reactive',
      '@formily/react',
      '@formily/core',
      '@formily/antd',
      'react-dnd',
      'react-dnd-html5-backend',
      '@monaco-editor/react',
      'moment',
      'mockjs',
      'braft-editor',
      'axios',
      'gogocode',
      ..._packagesNames,
    ],
  }

  const commonOutput = {
    name: targetName,
    sourcemap: true,
    amd: {
      id: targetName,
    },
  }

  const umd = {
    ...common,
    output: {
      format: 'umd',
      file: `dist/${filename}.js`,
      ...commonOutput,
    },
    plugins: [...presets(), ...plugins],
  }

  const umdProduction = {
    ...common,
    output: {
      format: 'umd',
      file: `dist/${filename}.production.js`,
      name: targetName,
      ...commonOutput,
    },
    plugins: [...presets(), terser(), ...plugins],
  }

  const esm = {
    ...common,
    output: {
      format: 'es',
      file: `dist/${filename}.esm.js`,
      name: targetName,
      ...commonOutput,
    },
    plugins: [...presets(), ...plugins],
  }

  return [umd, umdProduction, esm]
}
