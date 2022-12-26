import { RouteProp, useRoute } from '@react-navigation/native';

export default function useRouterParams<T extends object>() {
  const { params } = useRoute<RouteProp<{ params: T }>>();
  return params || ({} as T);
}
