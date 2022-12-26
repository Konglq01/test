import SuccessPageUI from 'pages/components/SuccessPageUI';
import { SuccessPageType } from 'types/UI';

export default function ImportSuccess({ onNext }: { onNext: () => void }) {
  return (
    <div className="fix-max-content">
      <SuccessPageUI type={SuccessPageType.Importing} onConfirm={onNext} />
    </div>
  );
}
