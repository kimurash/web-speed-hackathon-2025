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
  async fetcher(queries: { episodeId: string }[]) {
    const data = (await $fetch('/episodes', {
      query: {
        episodeIds: queries.map((q) => q.episodeId).join(','),
      },
    })) as StandardSchemaV1.InferOutput<typeof schema.getEpisodesResponse>;
    return data;
  },
  resolver(items, query: { episodeId: string }) {
    const item = items.find((item) => item.id === query.episodeId);
    if (item == null) {
      throw new Error('Episode is not found.');
    }
    return item;
  },
  scheduler: batshit.windowedFiniteBatchScheduler({
    maxBatchSize: 100,
    windowMs: 1000,
  }),
});

interface EpisodeService {
  fetchEpisodeById: (query: {
    episodeId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>>;
  fetchEpisodes: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodesResponse>>;
}

export const episodeService: EpisodeService = {
  async fetchEpisodeById({ episodeId }) {
    const channel = await batcher.fetch({ episodeId });
    return channel;
  },
  async fetchEpisodes() {
    const data = (await $fetch('/episodes', { query: {} })) as StandardSchemaV1.InferOutput<
      typeof schema.getEpisodesResponse
    >;
    return data;
  },
};
