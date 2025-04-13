import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/openapi/schema';
import { produce } from 'immer';

import { channelService } from '@wsh-2025/client/src/features/channel/services/channelService';

type ChannelId = string;

interface ChannelState {
  channels: Record<ChannelId, StandardSchemaV1.InferOutput<typeof schema.getChannelByIdResponse>>;
}

interface ChannelActions {
  fetchChannelById: (params: {
    channelId: ChannelId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getChannelByIdResponse>>;
  fetchChannels: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getChannelsResponse>>;
}

export const createChannelStoreSlice = () => {
  return lens<ChannelState & ChannelActions>((set) => ({
    channels: {},
    fetchChannelById: async ({ channelId }) => {
      const channel = await channelService.fetchChannelById({ channelId });
      set((state) => {
        return produce(state, (draft) => {
          draft.channels[channel.id] = channel;
        });
      });
      return channel;
    },
    fetchChannels: async () => {
      const channels = await channelService.fetchChannels();
      set((state) => {
        return produce(state, (draft) => {
          for (const channel of channels) {
            draft.channels[channel.id] = channel;
          }
        });
      });
      return channels;
    },
  }));
};
