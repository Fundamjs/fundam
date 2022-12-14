import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  alias: {
    '@fundam/editor': `${process.cwd()}/packages/editor/src`,
    '@fundam/shared': `${process.cwd()}/packages/shared/src`,
  },
});
