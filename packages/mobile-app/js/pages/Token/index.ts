import ManageTokenList from './ManageTokenList';
import TokenDetail from './TokenDetail/index';
import TransferDetail from './TransferDetail/index';

const stackNav = [
  { name: 'ManageTokenList', component: ManageTokenList },
  { name: 'TokenDetail', component: TokenDetail },
  { name: 'TransferDetail', component: TransferDetail },
] as const;

export default stackNav;
