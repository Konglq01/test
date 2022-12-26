import { useRoutes } from 'react-router-dom';
import Unlock from '../../Unlock';
import RegisterWallet from '../../RegisterWallet';
import CreateWallet from '../../CreateWallet';
import BackupWallet from '../../BackupWallet';
import WalletHome from '../../Home';
import LoadWallet from '../../LoadWallet';
import SuccessPage from '../SuccessPage';
import ScreenOpeningPage from '../ScreenOpening';
import Send from 'pages/Send';
import AddToken from 'pages/Token/Manage';
import TokenDetail from 'pages/Token/Detail';
// import AddressBook from 'pages/AddressBook';
import Receive from 'pages/Receive';
// import SecurityPrivacy from 'pages/SecurityPrivacy';
// import GlobalSetting from 'pages/GlobalSetting';
import Permission from '../Permission';
import SwitchChain from 'pages/SwitchChain';
import ConnectWallet from 'pages/ConnectWallet';
// import AboutUs from 'pages/AboutUs';
import SignMessage from 'pages/SignMessage';
import GetSignature from 'pages/GetSignature';
import PromptSetting from 'pages/PromptSetting';
import TermsOfService from 'pages/TermsOfService';
import ContractListPage from 'pages/ContractListPage';
import TransactionDetailPage from 'pages/TransactionDetailPage';
import AccountInfoPage from 'pages/AccountInfoPage';
import ImportAccountPage from 'pages/ImportAccountPage';
import CreateAccountPage from 'pages/CreateAccountPage';

export const PageRouter = () =>
  useRoutes([
    {
      path: '/',
      element: <WalletHome />,
    },
    {
      path: '/unlock',
      element: <Unlock />,
    },
    {
      path: '/unlock/:promptType',
      element: <Unlock />,
    },
    {
      path: '/permission',
      element: <Permission />,
    },
    {
      path: '/permission/:state',
      element: <Permission />,
    },
    {
      path: '/register',
      element: <ScreenOpeningPage />,
    },
    {
      path: '/register/start',
      element: <RegisterWallet />,
    },
    {
      path: '/register/create',
      element: <CreateWallet />,
    },
    {
      path: '/success-page/:type',
      element: <SuccessPage />,
    },
    {
      path: '/register/backup',
      element: <BackupWallet />,
    },
    {
      path: '/register/load',
      element: <LoadWallet />,
    },
    // {
    //   path: '/setting/address-book',
    //   element: <AddressBook />,
    // },
    // {
    //   path: '/setting/global-setting',
    //   element: <GlobalSetting />,
    // },
    {
      path: '/send/:symbol/:address',
      element: <Send />,
    },
    {
      path: '/receive',
      element: <Receive />,
    },
    {
      path: '/unlock',
      element: <Unlock />,
    },
    {
      path: '/token/manage',
      element: <AddToken />,
    },
    // {
    //   path: 'setting/security-privacy',
    //   element: <SecurityPrivacy />,
    // },
    // {
    //   path: '/setting/about-us',
    //   element: <AboutUs />,
    // },
    {
      path: '/token/detail/:symbol/:address',
      element: <TokenDetail />,
    },
    {
      path: '/switch-chain',
      element: <SwitchChain />,
    },
    {
      path: '/connect-wallet',
      element: <ConnectWallet />,
    },
    {
      path: '/sign-message',
      element: <SignMessage />,
    },
    {
      path: '/get-signature',
      element: <GetSignature />,
    },
    {
      path: '/setting/:menuKey',
      element: <PromptSetting />,
    },
    {
      path: '/setting/:menuKey/:subMenuKey',
      element: <PromptSetting />,
    },
    {
      path: '/setting',
      element: <PromptSetting />,
    },
    {
      path: '/terms-of-service',
      element: <TermsOfService />,
    },
    {
      path: '/send/contracts',
      element: <ContractListPage />,
    },
    {
      path: '/transaction-detail',
      element: <TransactionDetailPage />,
    },
    {
      path: '/account-info',
      element: <AccountInfoPage />,
    },
    {
      path: '/import-account',
      element: <ImportAccountPage />,
    },
    {
      path: '/create-account',
      element: <CreateAccountPage />,
    },
    {
      path: '*',
      element: <Unlock />,
    },
  ]);
