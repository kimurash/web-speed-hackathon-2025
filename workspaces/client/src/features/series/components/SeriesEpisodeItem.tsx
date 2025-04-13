import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';

interface Props {
  episode: {
    description: string;
    id: string;
    premium: boolean;
    thumbnailUrl: string;
    title: string;
  };
  selected: boolean;
}

export const SeriesEpisodeItem = ({ episode, selected }: Props) => {
  return (
    <NavLink
      viewTransition
      className="block flex w-full cursor-pointer flex-row items-start justify-between gap-x-[16px] hover:opacity-75"
      to={`/episodes/${episode.id}`}
    >
      {({ isTransitioning }) => {
        return (
          <>
            <Flipped stagger flipId={!selected && isTransitioning ? `episode-${episode.id}` : 0}>
              <div className="relative shrink-0 grow-0 overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F] before:absolute before:inset-x-0 before:bottom-0 before:block before:h-[64px] before:bg-gradient-to-t before:from-[#212121] before:to-transparent before:content-['']">
                <img
                  alt=""
                  className="aspect-video h-auto w-[192px]"
                  // loading="lazy"
                  // decoding="async"
                  src={episode.thumbnailUrl}
                />
                <span className="i-material-symbols:play-arrow-rounded absolute bottom-[4px] left-[4px] m-[4px] block size-[20px] text-[#ffffff]" />
                {episode.premium ? (
                  <span className="absolute bottom-[8px] right-[4px] inline-flex items-center justify-center rounded-[4px] bg-[#1c43d1] p-[4px] text-[10px] text-[#ffffff]">
                    プレミアム
                  </span>
                ) : null}
              </div>
            </Flipped>

            <div className="grow-1 shrink-1">
              <div className="mb-[8px] line-clamp-2 text-[18px] font-bold text-[#ffffff]">{episode.title}</div>
              <div className="line-clamp-2 text-[12px] text-[#999999]">{episode.description}</div>
            </div>
          </>
        );
      }}
    </NavLink>
  );
};
