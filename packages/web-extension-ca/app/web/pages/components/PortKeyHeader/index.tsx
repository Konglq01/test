import { forwardRef, useEffect } from 'react';
import { useAppDispatch, useCommonState, useWalletInfo } from 'store/Provider/hooks';
import CustomSvg from 'components/CustomSvg';
import svgsList from 'assets/svgs';
import './index.less';
import { fetchChainListAsync } from '@portkey/store/network/actions';

export type WalletAvatar = keyof typeof svgsList;

interface PortKeyHeaderProps {
  onUserClick?: (e?: any) => void;
  customLogoShow?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PortKeyHeader = forwardRef(({ onUserClick, customLogoShow = true }: PortKeyHeaderProps, ref) => {
  const dispatch = useAppDispatch();
  const { isPrompt } = useCommonState();
  const { walletAvatar } = useWalletInfo();

  useEffect(() => {
    try {
      dispatch(fetchChainListAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    // <div className={isPrompt ? 'prompt-portkey-header' : 'portkey-header'}>
    <div className={'portkey-header'}>
      <div className="portkey-header-body">
        <div className="porkey-area">
          <CustomSvg type="PortKey" className="portkey-logo" />
          {isPrompt && <div className="portkey-label">PORTKEY</div>}
        </div>

        {customLogoShow && (
          <CustomSvg className="custom-logo" type={(walletAvatar as WalletAvatar) || 'master1'} onClick={onUserClick} />
        )}
      </div>
    </div>
  );
});

export default PortKeyHeader;

export interface PortKeyHeaderInstance {
  showManageNetwork: () => void;
}
