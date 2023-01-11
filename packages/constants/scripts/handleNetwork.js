const fs = require('fs');
const path = require('path');

const newPath = path.resolve(__dirname, `../constants-ca/network.ts`);

fs.writeFileSync(newPath, `export * from './network-testnet';\n`);
