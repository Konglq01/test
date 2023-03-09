import RegisterStart from 'pages/RegisterStart';
import SelectVerifier from 'pages/SelectVerifier';
import { useRoutes } from 'react-router-dom';
import Home from 'pages/Home';
import ScreenOpeningPage from 'pages/ScreenOpening';
import Wallet from 'pages/Wallet';
import VerifierAccount from 'pages/VerifierAccount';
import Contacts from 'pages/Contacts';
import SetWalletPin from 'pages/SetWalletPin';
import SuccessPage from 'pages/SuccessPage';
import GuardianApproval from 'pages/GuardianApproval';
import Guardians from 'pages/Guardians';
import GuardiansEdit from 'pages/Guardians/GuardiansEdit';
import GuardiansView from 'pages/Guardians/GuardiansView';
import AddToken from 'pages/Token/Manage';
import Receive from 'pages/Receive';
import AddGuardian from 'pages/Guardians/GuardiansAdd';
import TokenDetail from 'pages/Token/Detail';
import AccountSetting from 'pages/AccountSetting';
import Contact from 'pages/Contacts/ContactDetail';
import My from 'pages/My';
import Send from 'pages/Send';
import Transaction from 'pages/Transaction';
import NFT from 'pages/NFT';
import Unlock from 'pages/Unlock';
import QueryPage from 'pages/QueryPage';
import TestSocket from 'pages/TestSocket';
import Device from 'pages/WalletSecurity/ManageDevices';
import SetPin from 'pages/AccountSetting/SetPin';
import NotFound from 'pages/NotFound';
import Example from 'pages/Example';
import SignUpUI from 'pages/Example/SignUpUI';
import WalletSecurity from 'pages/WalletSecurity';

export const PageRouter = () =>
  useRoutes([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/register',
      element: <ScreenOpeningPage />,
    },
    {
      path: '/register/start',
      element: <RegisterStart />,
    },
    {
      path: '/register/start/:type',
      element: <RegisterStart />,
    },
    {
      path: '/register/select-verifier',
      element: <SelectVerifier />,
    },
    {
      path: '/register/verifier-account',
      element: <VerifierAccount />,
    },
    {
      path: '/login/set-pin/:type',
      element: <SetWalletPin />,
    },
    {
      path: '/success-page/:type',
      element: <SuccessPage />,
    },
    {
      path: '/login/guardian-approval',
      element: <GuardianApproval />,
    },
    {
      path: '/login/verifier-account',
      element: <VerifierAccount />,
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
      element: <Device />,
    },
    {
      path: '/unlock',
      element: <Unlock />,
    },
    {
      path: 'query-page',
      element: <QueryPage />,
    },
    {
      path: '/test/example-ui',
      element: <Example />,
    },
    {
      path: '/test/example-SignUpUI',
      element: <SignUpUI />,
    },
    {
      path: '/test/socket',
      element: <TestSocket />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
