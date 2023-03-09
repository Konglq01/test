import { Button } from 'antd';
import { useAppDispatch } from 'store/Provider/hooks';
import { setCountryModal } from 'store/reducers/modal/slice';

export default function Example() {
  const dispatch = useAppDispatch();
  return (
    <div>
      <Button
        onClick={() => {
          //
          dispatch(setCountryModal(true));
        }}>
        CountryCode
      </Button>
    </div>
  );
}
