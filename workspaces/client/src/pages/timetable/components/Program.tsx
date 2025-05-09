import { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/openapi/schema';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { ArrayValues } from 'type-fest';

import { ProgramDetailDialog } from '@wsh-2025/client/src/pages/timetable/components/ProgramDetailDialog';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';
import { useCurrentUnixtimeMs } from '@wsh-2025/client/src/pages/timetable/hooks/useCurrentUnixtimeMs';
import { useSelectedProgramId } from '@wsh-2025/client/src/pages/timetable/hooks/useSelectedProgramId';

interface Props {
  height: number;
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const Program = ({ height, program }: Props): ReactElement => {
  const width = useColumnWidth(program.channelId);

  const [selectedProgramId, setProgram] = useSelectedProgramId();
  const shouldProgramDetailDialogOpen = program.id === selectedProgramId;
  const onClick = () => {
    setProgram(program);
  };

  const currentUnixtimeMs = useCurrentUnixtimeMs();
  const isBroadcasting =
    dayjs(program.startAt).valueOf() <= dayjs(currentUnixtimeMs).valueOf() &&
    dayjs(currentUnixtimeMs).valueOf() < dayjs(program.endAt).valueOf();
  const isArchived = dayjs(program.endAt).valueOf() <= dayjs(currentUnixtimeMs).valueOf();

  const titleRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [shouldImageBeVisible, setShouldImageBeVisible] = useState<boolean>(false);
  useEffect(() => {
    const interval = setInterval(() => {
      const imageHeight = imageRef.current?.clientHeight ?? 0;
      const titleHeight = titleRef.current?.clientHeight ?? 0;
      setShouldImageBeVisible(imageHeight <= height - titleHeight);
    }, 250);
    return () => {
      clearInterval(interval);
    };
  }, [height]);

  return (
    <>
      <button
        className={classNames(
          'w-auto cursor-pointer border-[1px] border-solid border-[#000000] px-[12px] py-[8px] text-left brightness-200 hover:brightness-125',
          isBroadcasting ? 'bg-[#FCF6E5]' : 'bg-[#212121]',
          isArchived ? 'opacity-50' : 'opacity-100',
        )}
        style={{ height, width }}
        type="button"
        onClick={onClick}
      >
        <div className="flex size-full flex-col overflow-hidden">
          <div ref={titleRef} className="mb-[8px] flex flex-row items-start justify-start">
            <span
              className={classNames(
                'mr-[8px] shrink-0 grow-0 text-[14px] font-bold',
                isBroadcasting ? 'text-[#767676]' : 'text-[#999999]',
              )}
            >
              {dayjs(program.startAt).format('mm')}
            </span>
            <div
              className={classNames(
                'grow-1 shrink-1 line-clamp-3 overflow-hidden text-[14px] font-bold',
                isBroadcasting ? 'text-[#212121]' : 'text-[#ffffff]',
              )}
            >
              {program.title}
            </div>
          </div>
          <div className={classNames('w-full', shouldImageBeVisible ? 'opacity-100' : 'opacity-0')}>
            <img
              ref={imageRef}
              alt=""
              className="pointer-events-none aspect-video w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
              // loading="lazy"
              // decoding="async"
              src={program.thumbnailUrl}
            />
          </div>
        </div>
      </button>
      <ProgramDetailDialog isOpen={shouldProgramDetailDialogOpen} program={program} />
    </>
  );
};
