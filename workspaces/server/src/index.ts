import '@wsh-2025/server/src/setups/luxon';

import compress from '@fastify/compress';
import cors from '@fastify/cors';
import fastify from 'fastify';

import { registerApi } from '@wsh-2025/server/src/api';
import { initializeDatabase } from '@wsh-2025/server/src/drizzle/database';
import { registerSsr } from '@wsh-2025/server/src/ssr';
import { registerStreams } from '@wsh-2025/server/src/streams';

async function main() {
  await initializeDatabase();

  const app = fastify();

  app.addHook('onSend', async (_req, reply) => {
    reply.headers({
      'x-robots-tag': 'noindex',
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await app.register(compress, { global: true });
  // 全てのオリジンからのリクエストを許可
  app.register(cors, {
    origin: true,
  });
  app.register(registerApi, { prefix: '/api' });
  app.register(registerStreams);
  app.register(registerSsr);

  await app.ready();
  const address = await app.listen({ host: '0.0.0.0', port: Number(process.env['PORT']) });
  console.log(`Server listening at ${address}`);
}

void main();
