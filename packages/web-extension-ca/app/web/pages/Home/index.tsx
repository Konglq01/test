import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import popupHandler from 'utils/popupHandler';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import MyBalance from './components/MyBalance';
import './index.less';

export default function Home() {
  const navigate = useNavigate();
  const { isPopupInit } = useCommonState();

  const onUserClick = useCallback(() => {
    navigate(`/setting`);
  }, [navigate]);

  const { setLoading } = useLoading();
  const getLocationState = useCallback(async () => {
    try {
      if (!isPopupInit) return;
      setLoading(1);
      const isExpire = await popupHandler.popupActive();
      if (isExpire) {
        setLoading(false);
        return navigate('/');
      }

      const lastLocationState = await getLocalStorage('lastLocationState');
      setLoading(false);
      if (!lastLocationState?.path) {
        lastLocationState.path = '/';
      }
      navigate(lastLocationState.path, { state: lastLocationState.state });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [isPopupInit, navigate, setLoading]);

  useEffect(() => {
    getLocationState();
  }, [getLocationState, setLoading]);

  return (
    <div className="portkey-home">
      <PortKeyHeader onUserClick={onUserClick} />
      <div className="portkey-home-body">
        <MyBalance />
      </div>
    </div>
  );
}
