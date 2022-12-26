import { ReactNode } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import PortKeyHeader from '../PortKeyHeader';
import { useNavigate } from 'react-router';
import './index.less';

interface PromptCommonPageProps {
  children?: ReactNode;
  onUserClick?: (e?: any) => void;
}

export default function PromptCommonPage({ children, onUserClick }: PromptCommonPageProps) {
  const { isPrompt } = useCommonState();
  const navigate = useNavigate();

  return (
    <div className="popup-common-body prompt-common-body">
      {isPrompt && (
        <PortKeyHeader
          onUserClick={
            onUserClick ||
            (() => {
              navigate(`/setting`);
            })
          }
        />
      )}

      <div className="popup-common-box prompt-common-box">{children}</div>
    </div>
  );
}
