import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../server/routers/_app';

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';

  // assume localhost
  return `http://localhost:3000`;
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/v11/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/v11/ssr
   **/
  ssr: false,
});
