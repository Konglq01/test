import ScanBaseCom, { ScanBaseProps } from './index.component';
import { BaseConfigProvider } from '../config-provider';

export default function ScanBase(props?: ScanBaseProps) {
  return (
    <BaseConfigProvider>
      <ScanBaseCom {...props} />
    </BaseConfigProvider>
  );
}
