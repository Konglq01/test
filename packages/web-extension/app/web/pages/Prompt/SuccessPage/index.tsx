import { useCallback } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { SuccessPageType } from 'types/UI';
import SuccessPageUI from '../../components/SuccessPageUI';

export default function SuccessPage() {
  const navigate = useNavigate();
  const { type } = useParams();
  const onConfirm = useCallback(() => {
    type === SuccessPageType.Creating ? navigate('/register/backup', { state: 'successPage' }) : navigate('/');
  }, [navigate, type]);

  return <SuccessPageUI type={type as SuccessPageType} onConfirm={onConfirm} />;
}
