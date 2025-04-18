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
  async fetcher(queries: { channelId: string }[]) {
    const data = (await $fetch('/channels', {
      query: {
        channelIds: queries.map((q) => q.channelId).join(','),
      },
    })) as StandardSchemaV1.InferOutput<typeof schema.getChannelsResponse>;
    return data;
  },
  resolver(items, query: { channelId: string }) {
    const item = items.find((item) => item.id === query.channelId);
    if (item == null) {
      throw new Error('Channel is not found.');
    }
    return item;
  },
  scheduler: batshit.windowedFiniteBatchScheduler({
    maxBatchSize: 100,
    windowMs: 1000,
  }),
});

interface ChannelService {
  fetchChannelById: (query: {
    channelId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getChannelByIdResponse>>;
  fetchChannels: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getChannelsResponse>>;
}

export const channelService: ChannelService = {
  async fetchChannelById({ channelId }) {
    const channel = await batcher.fetch({ channelId });
    return channel;
  },
  async fetchChannels() {
    const data = (await $fetch('/channels', { query: {} })) as StandardSchemaV1.InferOutput<
      typeof schema.getChannelsResponse
    >;
    return data;
  },
};
