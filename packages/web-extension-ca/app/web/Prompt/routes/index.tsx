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
import Contact from 'pages/ContactDetail';
import My from 'pages/My';
import Send from 'pages/Send';
import Transaction from 'pages/Transaction';
import NFT from 'pages/NFT';
import Unlock from 'pages/Unlock';
import QueryPage from 'pages/QueryPage';
import TestSocket from 'pages/TestSocket';

// TODO delete unnecessary pages
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
      path: '/register/set-pin',
      element: <SetWalletPin />,
    },
    {
      path: '/login/set-pin',
      element: <SetWalletPin />,
    },
    {
      path: '/scan/set-pin',
      element: <SetWalletPin />,
    },
    {
      path: '/register/success',
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
      path: '/unlock',
      element: <Unlock />,
    },
    {
      path: 'query-page',
      element: <QueryPage />,
    },
    {
      path: '/test/socket',
      element: <TestSocket />,
    },
    {
      path: '*',
      element: <Home />,
    },
  ]);
