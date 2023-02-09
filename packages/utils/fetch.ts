import { stringify } from 'query-string';

export interface CustomFetchConfig extends RequestInit {
  timeout?: number;
  params?: Record<string, any>;
}

export type CustomFetchFun = (
  url: string, // baseURL
  _config?: CustomFetchConfig,
) => Promise<{ type: 'timeout' } | any>;

const defaultHeaders = {
  Accept: 'text/plain;v=1.0',
  'Content-Type': 'application/json',
};

function formatResponse(response: string) {
  let result;
  try {
    result = JSON.parse(response);
  } catch (e) {
    result = response;
  }
  return result;
}

const timeoutPromise = (delay?: number) => {
  return new Promise(_resolve => {
    const ids = setTimeout(() => {
      clearTimeout(ids);
      _resolve({ type: 'timeout' });
    }, delay);
  });
};

const fetchFormat = (requestConfig: RequestInit & { url: string; params?: any }) => {
  const { url, signal, params = {}, method = 'GET', headers } = requestConfig;
  let body: RequestInit['body'] = JSON.stringify(params);
  let uri = url;
  const _method = method.toUpperCase();
  if (_method === 'GET' || _method === 'DELETE') {
    uri = Object.keys(params).length > 0 ? `${uri}?${stringify(params)}` : uri;
    body = undefined;
  } else {
    if (requestConfig.body) body = requestConfig.body;
  }
  delete requestConfig.params;

  const myHeaders = new Headers();
  Object.entries({ ...defaultHeaders, ...headers }).forEach(([headerItem, value]) => {
    myHeaders.append(headerItem, value);
  });
  return fetch(uri, {
    ...requestConfig,
    method: _method,
    headers: myHeaders,
    signal,
    body,
  });
};

export const customFetch: CustomFetchFun = (url, _config) => {
  const control = new AbortController();
  const timeout = _config?.timeout ?? 8000;
  delete _config?.timeout;
  const config: RequestInit & { url: string; params?: any } = {
    ..._config,
    url,
    signal: control.signal,
    credentials: 'omit',
  };

  return Promise.race([fetchFormat(config), timeoutPromise(timeout)]).then(
    (result: any) =>
      new Promise((resolve, reject) => {
        try {
          if (result.type === 'timeout') {
            // Cancel timeout request
            if (control.abort) control.abort();
            reject('timeout');
          } else {
            const _result = result as Response;
            console.log(result, 'customFetch===');
            _result
              .text()
              .then((text: string) => {
                const res = formatResponse(text);
                if (result.status !== 200 || !result.ok) {
                  reject(res ? res : _result.statusText);
                  return;
                }
                resolve(res);
              })
              .catch((err: any) => reject(err));
          }
        } catch (e) {
          reject(e);
        }
      }),
  );
};
