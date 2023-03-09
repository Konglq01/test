const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, `../constants-ca/network.ts`);

fs.writeFileSync(filePath, `export * from './network-test2';\n`);
