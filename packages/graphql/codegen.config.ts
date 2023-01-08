import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  generates: {
    './contract/__generated__/resolversTypes.ts': {
      schema: 'http://192.168.66.87:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
      plugins: ['typescript'],
    },
  },
};
export default config;
