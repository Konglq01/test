import { randomId } from '@portkey/utils';

const timeWorker: any = {};

export function setTimeoutInterval(fn: any, time: number) {
  const key = randomId();
  const execute = function (executeFn: any, executeTime: number) {
    timeWorker[key] = setTimeout(() => {
      fn();
      execute(executeFn, executeTime);
    }, time);
  };
  execute(fn, time);
  return key;
}

export function clearTimeoutInterval(key: string) {
  if (key in timeWorker) {
    clearTimeout(timeWorker[key]);
    delete timeWorker[key];
  }
}
