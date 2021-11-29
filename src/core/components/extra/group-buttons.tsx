import React from 'react';
import { useGroups } from '../../hooks';

export type GroupButtonsProps = React.HTMLProps<HTMLButtonElement>;

const GroupNextComponent: React.FC<GroupButtonsProps> = ({ onClick, children, ...props }) => {
  const [, groupsApi] = useGroups();
  return (
    <button
      {...props}
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

const GroupPrevComponent: React.FC<GroupButtonsProps> = ({ onClick, children, ...props }) => {
  const [, groupsApi] = useGroups();
  return (
    <button
      {...props}
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

export const GroupNext = GroupNextComponent;
export const GroupPrev = GroupPrevComponent;
