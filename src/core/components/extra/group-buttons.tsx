import React, { PropsWithoutRef } from 'react';
import { useGroups } from '../../hooks';
import { FieldRefProp } from '../../types';

export type GroupButtonsProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export interface GroupJumpButtonsProps extends GroupButtonsProps {
  to: string;
}

const GroupNextComponent = ({
  onClick,
  children,
  uRef,
  ...props
}: PropsWithoutRef<GroupButtonsProps & FieldRefProp<HTMLButtonElement>>) => {
  const [, groupsApi] = useGroups();
  return (
    <button
      type="button"
      {...props}
      ref={uRef}
      onClick={(e) => {
        e.persist();
        groupsApi.nextGroup();
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </button>
  );
};

GroupNextComponent.displayName = 'GroupNext';

const GroupPrevComponent = ({
  onClick,
  children,
  uRef,
  ...props
}: PropsWithoutRef<GroupButtonsProps & FieldRefProp<HTMLButtonElement>>) => {
  const [, groupsApi] = useGroups();
  return (
    <button
      type="button"
      {...props}
      ref={uRef}
      onClick={(e) => {
        e.persist();
        groupsApi.prevGroup();
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </button>
  );
};

GroupPrevComponent.displayName = 'GroupPrev';

const GroupJumpComponent = ({
  onClick,
  to,
  children,
  uRef,
  ...props
}: PropsWithoutRef<GroupJumpButtonsProps & FieldRefProp<HTMLButtonElement>>) => {
  const [, groupsApi] = useGroups();
  return (
    <button
      type="button"
      {...props}
      ref={uRef}
      onClick={(e) => {
        e.persist();
        groupsApi.getGroup(to)?.setActive();
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </button>
  );
};

GroupJumpComponent.displayName = 'GroupJump';

export const GroupNext = GroupNextComponent;
export const GroupPrev = GroupPrevComponent;
export const GroupJump = GroupJumpComponent;
