import classNames from 'classnames';
import { Children, cloneElement, ReactElement, Ref, useRef } from 'react';
import { useMergeRefs } from 'use-callback-ref';

interface Props {
  children: ReactElement<{ className?: string; ref?: Ref<unknown> }>;
  classNames: {
    default?: string;
    hovered?: string;
  };
}

export const Hoverable = (props: Props) => {
  const child = Children.only(props.children);
  const elementRef = useRef<HTMLDivElement>(null);

  const mergedRef = useMergeRefs([elementRef, child.props.ref].filter((v) => v != null));

  return cloneElement(child, {
    className: classNames(
      child.props.className,
      'cursor-pointer',
      `${props.classNames.default} hover:${props.classNames.hovered}`,
    ),
    ref: mergedRef,
  });
};
