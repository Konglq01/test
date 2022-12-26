import SuccessPageUI from 'pages/components/SuccessPageUI';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { SuccessPageType } from 'types/UI';

export default function CreateSuccess() {
  const navigate = useNavigate();
  const onConfirm = useCallback(() => navigate('/'), [navigate]);
  return (
    <div className="fix-max-content">
      <SuccessPageUI type={SuccessPageType.Imported} onConfirm={onConfirm} />
    </div>
  );
}
