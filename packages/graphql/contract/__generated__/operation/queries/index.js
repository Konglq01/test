const fs = require('fs');
const path = require('path');

module.exports.tokenInfo = fs.readFileSync(path.join(__dirname, 'tokenInfo.gql'), 'utf8');
module.exports.nftProtocolInfo = fs.readFileSync(path.join(__dirname, 'nftProtocolInfo.gql'), 'utf8');
module.exports.caHolderTransaction = fs.readFileSync(path.join(__dirname, 'caHolderTransaction.gql'), 'utf8');
module.exports.caHolderManagerInfo = fs.readFileSync(path.join(__dirname, 'caHolderManagerInfo.gql'), 'utf8');
module.exports.loginGuardianAccountInfo = fs.readFileSync(path.join(__dirname, 'loginGuardianAccountInfo.gql'), 'utf8');
module.exports.userNFTProtocolInfo = fs.readFileSync(path.join(__dirname, 'userNFTProtocolInfo.gql'), 'utf8');
module.exports.userNFTInfo = fs.readFileSync(path.join(__dirname, 'userNFTInfo.gql'), 'utf8');
module.exports.caHolderTokenBalanceInfo = fs.readFileSync(path.join(__dirname, 'caHolderTokenBalanceInfo.gql'), 'utf8');
module.exports.caHolderTransactionAddressInfo = fs.readFileSync(
  path.join(__dirname, 'caHolderTransactionAddressInfo.gql'),
  'utf8',
);
module.exports.loginGuardianAccountChangeRecordInfo = fs.readFileSync(
  path.join(__dirname, 'loginGuardianAccountChangeRecordInfo.gql'),
  'utf8',
);
module.exports.caHolderManagerChangeRecordInfo = fs.readFileSync(
  path.join(__dirname, 'caHolderManagerChangeRecordInfo.gql'),
  'utf8',
);
module.exports.caHolderSearchTokenNFT = fs.readFileSync(path.join(__dirname, 'caHolderSearchTokenNFT.gql'), 'utf8');
module.exports.syncState = fs.readFileSync(path.join(__dirname, 'syncState.gql'), 'utf8');
