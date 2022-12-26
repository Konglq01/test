import aboutNav from './AboutUs';
// import helpAndFeedBackNav from './HelpAndFeedBack';
import securityAndPrivacyNav from './SecurityAndPrivacy/router';
import InnerSettings from './InnerSettings';
const stackNav = [
  // ...helpAndFeedBackNav,
  ...securityAndPrivacyNav,
  ...aboutNav,
  {
    name: 'InnerSettings',
    component: InnerSettings,
  },
] as const;

export default stackNav;
