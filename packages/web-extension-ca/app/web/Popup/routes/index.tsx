import Home from '../../pages/Home';
import { useRoutes } from 'react-router';
import Wallet from 'pages/Wallet';
import AddToken from 'pages/Token/Manage';
import Receive from 'pages/Receive';
import TokenDetail from 'pages/Token/Detail';
import Send from 'pages/Send';
import NFT from 'pages/NFT';
import Transaction from 'pages/Transaction';
import My from 'pages/My';
import Contacts from 'pages/Contacts';
import Contact from 'pages/ContactDetail';
import AccountSetting from 'pages/AccountSetting';
import Guardians from 'pages/Guardians';
import AddGuardian from 'pages/Guardians/GuardiansAdd';
import GuardiansEdit from 'pages/Guardians/GuardiansEdit';
import GuardiansView from 'pages/Guardians/GuardiansView';
import VerifierAccount from 'pages/VerifierAccount';
import GuardianApproval from 'pages/GuardianApproval';
import Unlock from 'pages/Unlock';

export const PageRouter = () =>
  useRoutes([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/setting',
      element: <My />,
    },
    {
      path: '/setting/wallet',
      element: <Wallet />,
    },
    {
      path: 'setting/contacts',
      element: <Contacts />,
    },
    {
      path: '/setting/contacts/:type',
      element: <Contact />,
    },
    {
      path: '/setting/account-setting',
      element: <AccountSetting />,
    },
    {
      path: '/setting/guardians',
      element: <Guardians />,
    },
    {
      path: '/setting/guardians/add',
      element: <AddGuardian />,
    },
    {
      path: '/setting/guardians/edit',
      element: <GuardiansEdit />,
    },
    {
      path: '/setting/guardians/view',
      element: <GuardiansView />,
    },
    {
      path: '/setting/guardians/verifier-account',
      element: <VerifierAccount />,
    },
    {
      path: '/setting/guardians/guardian-approval',
      element: <GuardianApproval />,
    },
    {
      path: '/add-token',
      element: <AddToken />,
    },
    {
      path: '/transaction',
      element: <Transaction />,
    },
    {
      path: '/token-detail',
      element: <TokenDetail />,
    },
    {
      path: '/send/:symbol',
      element: <Send />,
    },
    {
      path: '/send/:symbol/:tokenId',
      element: <Send />,
    },
    {
      path: '/receive/:symbol/:chainId',
      element: <Receive />,
    },
    {
      path: '/nft',
      element: <NFT />,
    },
    {
      path: '/unlock',
      element: <Unlock />,
    },
    {
      path: '*',
      element: <Home />,
    },
  ]);
