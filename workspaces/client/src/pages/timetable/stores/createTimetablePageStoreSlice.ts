import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/openapi/schema';
import { produce } from 'immer';
import { ArrayValues } from 'type-fest';

import { DEFAULT_WIDTH } from '@wsh-2025/client/src/features/timetable/constants/grid_size';

type ChannelId = string;
type Program = ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;

interface TimetablePageState {
  columnWidthRecord: Record<ChannelId, number>;
  currentUnixtimeMs: number;
  selectedProgramId: string | null;
  shownNewFeatureDialog: boolean;
}

interface TimetablePageActions {
  changeColumnWidth: (params: { channelId: string; delta: number }) => void;
  closeNewFeatureDialog: () => void;
  refreshCurrentUnixtimeMs: () => void;
  selectProgram: (program: Program | null) => void;
}

// 指定された時間内に連続して呼び出された場合
// 最後の呼び出しから指定時間が経過した後にのみ関数を実行する
function debounce(func: () => void, wait: number): () => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (): void {
    // 既存のタイマーがあればクリアする
    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }

    // 新しいタイマーを設定する
    timeoutId = setTimeout(() => {
      // 指定時間経過後に元の関数を直接呼び出す
      func();
      // 実行後にタイマーIDをリセット
      timeoutId = null;
    }, wait);
  };
}

export const createTimetablePageStoreSlice = () => {
  return lens<TimetablePageState & TimetablePageActions>((set, _get) => ({
    changeColumnWidth: (params: { channelId: string; delta: number }) => {
      set((state) => {
        return produce(state, (draft) => {
          const current = draft.columnWidthRecord[params.channelId] ?? DEFAULT_WIDTH;
          draft.columnWidthRecord[params.channelId] = Math.max(current + params.delta, 100);
        });
      });
    },
    closeNewFeatureDialog: () => {
      set(() => ({
        shownNewFeatureDialog: false,
      }));
    },
    columnWidthRecord: {},
    currentUnixtimeMs: 0,
    refreshCurrentUnixtimeMs: debounce(() => {
      set(() => ({
        currentUnixtimeMs: Date.now(),
      }));
    }, 50),
    selectedProgramId: null,
    selectProgram: (program: Program | null) => {
      set(() => ({
        selectedProgramId: program?.id ?? null,
      }));
    },
    shownNewFeatureDialog: true,
  }));
};
