import React from 'react';
import { useGroups } from '../../hooks';

export type GroupButtonsProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const GroupNextComponent = React.forwardRef<HTMLButtonElement, GroupButtonsProps>(
  ({ onClick, children, ...props }, ref) => {
    const [, groupsApi] = useGroups();
    return (
      <button
        {...props}
        ref={ref}
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
  },
);

GroupNextComponent.displayName = 'GroupNext';

const GroupPrevComponent = React.forwardRef<HTMLButtonElement, GroupButtonsProps>(
  ({ onClick, children, ...props }, ref) => {
    const [, groupsApi] = useGroups();
    return (
      <button
        {...props}
        ref={ref}
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
  },
);

GroupPrevComponent.displayName = 'GroupPrev';

const GroupJumpComponent = React.forwardRef<HTMLButtonElement, GroupButtonsProps & { to: string }>(
  ({ onClick, to, children, ...props }, ref) => {
    const [, groupsApi] = useGroups();
    return (
      <button
        {...props}
        ref={ref}
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
  },
);

GroupJumpComponent.displayName = 'GroupJump';

export const GroupNext = GroupNextComponent;
export const GroupPrev = GroupPrevComponent;
export const GroupJump = GroupJumpComponent;
