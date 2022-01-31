import React, { CSSProperties, ReactNode } from 'react';
import { useGroup } from '../../hooks';
import create from 'zustand';
import createContext from 'zustand/context';
import { GroupApiInterface, GroupsApiInterface } from '../../types';

export interface GroupState {
  name: string;
}

type GroupApiChildren = (group: GroupApiInterface, api: GroupsApiInterface) => ReactNode;

export interface GroupProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  defaultActive?: boolean;
  children: ReactNode | GroupApiChildren;
  displayAll?: boolean;
}

const { Provider, useStore } = createContext<GroupState>();

const GroupComponent = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ name, children, defaultActive, displayAll, style, ...props }, ref) => {
    const [groupApi, groupsAPi] = useGroup(name, { defaultActive, ...(defaultActive ? { isTouched: true } : {}) });
    const newStyle: CSSProperties = {
      ...style,
      ...(groupApi.isActive() || displayAll ? {} : { display: 'none' }),
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
        <div {...props} ref={ref} style={newStyle}>
          {childrenComponent}
        </div>
      </Provider>
    );
  },
);

GroupComponent.displayName = 'Group';

export const Group = GroupComponent;
export const useGroupStore = useStore;
