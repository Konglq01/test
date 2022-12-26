import { ActivityItemType } from '@portkey/types/types-ca/activity';
import response from './data.json';

console.log(response);

const MOCK_RESPONSE = {
  data: { total: response.data.total, items: response.data.items },
};

export function fetchActivities({
  start,
  limit,
}: {
  start: number;
  limit: number;
}): Promise<{ data: { total: number; items: ActivityItemType[] } }> {
  console.log('>>>fetching....list', start, limit, MOCK_RESPONSE);
  return new Promise(resolve => setTimeout(() => resolve(MOCK_RESPONSE), 1000));
}
