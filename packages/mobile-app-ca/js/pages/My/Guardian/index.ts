import SelectVerifier from './SelectVerifier';
import GuardianApproval from './GuardianApproval';
import VerifierDetails from './VerifierDetails';
import GuardianHome from './GuardianHome';
import GuardianEdit from './GuardianEdit';
import GuardianDetail from './GuardianDetail';

const stackNav = [
  { name: 'SelectVerifier', component: SelectVerifier },
  { name: 'GuardianApproval', component: GuardianApproval },
  { name: 'VerifierDetails', component: VerifierDetails },
  { name: 'GuardianHome', component: GuardianHome },
  { name: 'GuardianEdit', component: GuardianEdit },
  { name: 'GuardianDetail', component: GuardianDetail },
] as const;

export default stackNav;
