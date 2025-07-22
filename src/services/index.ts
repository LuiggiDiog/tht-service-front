import { mdiAlert } from '@mdi/js';
import { API_URL } from '../config';
import { useAuthStore } from '@/domains/auth';
import { useToastStore } from '@/domains/toast';
import { ColorKeyT } from '@/domains/toast/toast.colors';

type ApiFetchT = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | string | FormData;
  normalize?: boolean;
};

type ApiFetchResponseT = {
  code: string;
  message: string;
  data: unknown;
  other?: object;
};

const OK = 'BS200';

export default async function apiFetch<T>(props: ApiFetchT): Promise<T> {
  const { addToast } = useToastStore.getState();

  try {
    const { url, normalize = true } = props;

    const response = await fetch(
      `${API_URL}${url}`,
      prepareRequestOptions(props)
    );

    const data = (await response.json()) as ApiFetchResponseT;

    if (!normalize) {
      return data as T;
    }

    if (data.code !== OK) {
      throw data;
    }

    if (data.other) {
      const other = data.other as { message: string; type: string };
      addToast({
        description: other.message,
        color: other.type as ColorKeyT,
        icon: mdiAlert,
      });
    }

    return data.data as T;
  } catch (error) {
    console.error(error);
    const { message } = error as { code: string; message: string };

    addToast({
      description: message,
      color: 'warning',
      icon: mdiAlert,
    });
    return {} as T;
  }
}

function prepareRequestOptions(props: ApiFetchT) {
  const { token } = useAuthStore.getState();

  const { method = 'GET', headers, body } = props;

  const commonHeaders = {
    Authorization: `Bearer ${token}`,
    'Accept-Language': 'es',
    ...headers,
  };

  const options: RequestInit = {
    method,
    headers: {},
    body: undefined,
  };

  if (body instanceof FormData) {
    options.headers = commonHeaders;
    options.body = body;
  } else {
    options.headers = {
      ...commonHeaders,
      'Content-Type': 'application/json',
      ...headers,
    };
    options.body = body ? JSON.stringify(body) : undefined;
  }

  return options;
}
