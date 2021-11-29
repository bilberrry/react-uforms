import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import { useGroup } from '../../hooks';
import create, { GetState, SetState } from 'zustand';
import createContext from 'zustand/context';
import { GroupApiInterface, GroupInterface, GroupsApiInterface } from '../../types';

export interface GroupState {
  name: string;
}

type GroupApiChildren = (group: GroupApiInterface, api: GroupsApiInterface) => ReactNode;

export interface GroupProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  defaultActive?: boolean;
  children: ReactNode | GroupApiChildren;
}

const { Provider, useStore } = createContext<GroupState>();

const GroupComponent: React.FC<GroupProps> = ({ name, children, defaultActive, style, ...props }) => {
  const [groupApi, groupsAPi] = useGroup(name, { defaultActive, ...(defaultActive ? { isTouched: true } : {}) });
  const newStyle: CSSProperties = {
    ...style,
    ...(groupApi.isActive() ? {} : { display: 'none' }),
  };
  const childrenComponent = typeof children === 'function' ? children(groupApi, groupsAPi) : children;
  return (
    <Provider
      createStore={() =>
        create(() => ({
          name,
        }))
      }
    >
      <div {...props} style={newStyle}>
        {childrenComponent}
      </div>
    </Provider>
  );
};

GroupComponent.displayName = 'Group';

export const Group = GroupComponent;
export const useGroupStore = useStore;
