import { WORKER_KEEP_ALIVE_MESSAGE, TIME_45_MIN_IN_MS, WORKER_KEEP_ALIVE_INTERVAL } from 'constants/index';
import { apis } from './BrowserApis';

let keepAliveInterval: NodeJS.Timeout;
let keepAliveTimer: NodeJS.Timeout;
/**
 * Running this method will ensure the service worker is kept alive for 45 minutes.
 * The first message is sent immediately and subsequent messages are sent at an
 * interval of WORKER_KEEP_ALIVE_INTERVAL.
 */

export const runWorkerKeepAliveInterval = () => {
  clearTimeout(keepAliveTimer);

  keepAliveTimer = setTimeout(() => {
    clearInterval(keepAliveInterval);
  }, TIME_45_MIN_IN_MS);

  clearInterval(keepAliveInterval);

  apis.runtime.sendMessage({ name: WORKER_KEEP_ALIVE_MESSAGE });
  console.log('runWorkerKeepAliveInterval==keep', keepAliveTimer);
  keepAliveInterval = setInterval(() => {
    if (apis.runtime.id) {
      apis.runtime.sendMessage({ name: WORKER_KEEP_ALIVE_MESSAGE });
    }
  }, WORKER_KEEP_ALIVE_INTERVAL);
};
