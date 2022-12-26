import aboutNav from './AboutUs';
// import helpAndFeedBackNav from './HelpAndFeedBack';
import accountSettingsNav from './AccountSettings/router';
import InnerSettings from './InnerSettings';
const stackNav = [
  // ...helpAndFeedBackNav,
  ...accountSettingsNav,
  ...aboutNav,
  {
    name: 'InnerSettings',
    component: InnerSettings,
  },
] as const;

export default stackNav;
