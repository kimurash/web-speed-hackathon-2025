import { Flipped } from 'react-flip-toolkit';
import { Params, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';

export const prefetch = async (store: ReturnType<typeof createStore>, { seriesId }: Params) => {
  invariant(seriesId);
  const series = await store.getState().features.series.fetchSeriesById({ seriesId });
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: seriesId });
  return { modules, series };
};

export const SeriesPage = () => {
  type PrefetchReturnType = ReturnType<typeof prefetch>;
  const { modules, series } = useLoaderData<Awaited<PrefetchReturnType>>();
  invariant(series);

  return (
    <>
      <title>{`${series.title} - AremaTV`}</title>

      <div className="m-auto px-[24px] py-[48px]">
        <header className="mb-[24px] flex w-full flex-row items-start justify-between gap-[24px]">
          <Flipped stagger flipId={`series-${series.id}`}>
            <img
              alt=""
              className="h-auto w-[400px] shrink-0 grow-0 rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
              src={series.thumbnailUrl}
            />
          </Flipped>
          <div className="grow-1 shrink-1 overflow-hidden">
            <h1 className="mb-[16px] line-clamp-2 text-[32px] font-bold text-[#ffffff]">{series.title}</h1>
            <div className="line-clamp-3 text-[14px] text-[#999999]">{series.description}</div>
          </div>
        </header>

        <div className="mb-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">エピソード</h2>
          <SeriesEpisodeList episodes={series.episodes} selectedEpisodeId={null} />
        </div>

        {modules[0] != null ? (
          <div>
            <RecommendedSection module={modules[0]} />
          </div>
        ) : null}
      </div>
    </>
  );
};
