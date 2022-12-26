import Home from '../../Home';
import AddressBook from '../../AddressBook';
import { useRoutes } from 'react-router';
import Receive from 'pages/Receive';
import Unlock from 'pages/Unlock';
import GlobalSetting from 'pages/GlobalSetting';
import Send from 'pages/Send';
import AddToken from 'pages/Token/Manage';
import SecurityPrivacy from 'pages/SecurityPrivacy';
import TokenDetail from 'pages/Token/Detail';
import AboutUs from 'pages/AboutUs';

export const PageRouter = () =>
  useRoutes([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/unlock',
      element: <Unlock />,
    },
    {
      path: '/setting/address-book',
      element: <AddressBook />,
    },
    {
      path: '/receive',
      element: <Receive />,
    },

    {
      path: '/setting/address-book',
      element: <AddressBook />,
    },
    {
      path: '/setting/global-setting',
      element: <GlobalSetting />,
    },
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
      path: '/add-token',
      element: <AddToken />,
    },
    {
      path: 'setting/security-privacy',
      element: <SecurityPrivacy />,
    },
    {
      path: '/setting/about-us',
      element: <AboutUs />,
    },
    {
      path: '/token/manage',
      element: <AddToken />,
    },
    {
      path: '/token/detail/:symbol/:address',
      element: <TokenDetail />,
    },
    {
      path: '*',
      element: <Unlock />,
    },
  ]);
