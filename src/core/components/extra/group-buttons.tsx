import React, { PropsWithoutRef } from 'react';
import { useGroups } from '../../hooks';
import { FieldRefProp } from '../../types';

export type GroupButtonsProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export type GroupPrevButtonProps = GroupButtonsProps;
export interface GroupNextButtonProps extends GroupButtonsProps {
  onSuccess?: () => void;
  onError?: () => void;
  autoSubmit?: boolean;
}
export interface GroupJumpButtonProps extends GroupButtonsProps {
  to: string;
}

const GroupNextComponent = ({
  onClick,
  children,
  uRef,
  autoSubmit,
  onSuccess,
  onError,
  ...props
}: PropsWithoutRef<GroupNextButtonProps & FieldRefProp<HTMLButtonElement>>) => {
  const [, groupsApi] = useGroups();
  return (
    <button
      type="button"
      {...props}
      ref={uRef}
      onClick={async (e) => {
        e.persist();
        if (onClick) {
          onClick(e);
        }
        if (await groupsApi.nextGroup(!!autoSubmit)) {
          if (onSuccess) {
            onSuccess();
          }
        } else if (onError) {
          onError();
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
}: PropsWithoutRef<GroupPrevButtonProps & FieldRefProp<HTMLButtonElement>>) => {
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
}: PropsWithoutRef<GroupJumpButtonProps & FieldRefProp<HTMLButtonElement>>) => {
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
