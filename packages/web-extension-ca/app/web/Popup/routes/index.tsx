import { useRoutes } from 'react-router';
import Home from 'pages/Home';
import Wallet from 'pages/Wallet';
import Contacts from 'pages/Contacts';
import GuardianApproval from 'pages/GuardianApproval';
import AddToken from 'pages/Token/Manage';
import Receive from 'pages/Receive';
import TokenDetail from 'pages/Token/Detail';
import AccountSetting from 'pages/AccountSetting';
import My from 'pages/My';
import Send from 'pages/Send';
import NFT from 'pages/NFT';
import Transaction from 'pages/Transaction';
import Guardians from 'pages/Guardians';
import AddGuardian from 'pages/Guardians/GuardiansAdd';
import GuardiansEdit from 'pages/Guardians/GuardiansEdit';
import GuardiansView from 'pages/Guardians/GuardiansView';
import VerifierAccount from 'pages/VerifierAccount';
import Unlock from 'pages/Unlock';
import Contact from 'pages/Contacts/ContactDetail';
import ManageDevices from 'pages/WalletSecurity/ManageDevices';
import SetPin from 'pages/AccountSetting/SetPin';
import WalletSecurity from 'pages/WalletSecurity';

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
      path: '/setting/wallet',
      element: <Wallet />,
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
      path: '/send/:type/:symbol',
      element: <Send />,
    },
    {
      path: '/receive/:type/:symbol',
      element: <Receive />,
    },
    {
      path: '/nft',
      element: <NFT />,
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
      path: '/setting/account-setting/set-pin',
      element: <SetPin />,
    },
    {
      path: '/setting/wallet-security',
      element: <WalletSecurity />,
    },
    {
      path: '/setting/wallet-security/manage-devices',
      element: <ManageDevices />,
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
