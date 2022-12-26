import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import LockPage from 'pages/components/LockPage';
import { useCallback } from 'react';
import errorHandler from 'utils/errorHandler';

export default function Permission() {
  const onUnLockHandler = useCallback(async () => {
    InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
      closeParams: { ...errorHandler(0), data: { isLocked: true } },
    }).send();
  }, []);
  return (
    <div>
      <LockPage onUnLockHandler={onUnLockHandler} />
    </div>
  );
}
