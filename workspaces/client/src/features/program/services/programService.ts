/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createFetch } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/openapi/schema';
import * as batshit from '@yornaath/batshit';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  throw: true,
});

const batcher = batshit.create({
  async fetcher(queries: { programId: string }[]) {
    const data = (await $fetch('/programs', {
      query: {
        programIds: queries.map((q) => q.programId).join(','),
      },
    })) as StandardSchemaV1.InferOutput<typeof schema.getProgramsResponse>;
    return data;
  },
  resolver(items, query: { programId: string }) {
    const item = items.find((item) => item.id === query.programId);
    if (item == null) {
      throw new Error('Program is not found.');
    }
    return item;
  },
  scheduler: batshit.windowedFiniteBatchScheduler({
    maxBatchSize: 100,
    windowMs: 1000,
  }),
});

interface ProgramService {
  fetchProgramById: (query: {
    programId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getProgramByIdResponse>>;
  fetchPrograms: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getProgramsResponse>>;
}

export const programService: ProgramService = {
  async fetchProgramById({ programId }) {
    const channel = await batcher.fetch({ programId });
    return channel;
  },
  async fetchPrograms() {
    const data = (await $fetch('/programs', { query: {} })) as StandardSchemaV1.InferOutput<
      typeof schema.getProgramsResponse
    >;
    return data;
  },
};
