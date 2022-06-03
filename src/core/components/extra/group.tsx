import React, { CSSProperties, PropsWithoutRef, ReactNode } from 'react';
import { useGroup } from '../../hooks';
import create from 'zustand';
import createContext from 'zustand/context';
import { FieldRefProp, GroupApiInterface, GroupsApiInterface } from '../../types';

export interface GroupState {
  name: string;
}

type GroupApiChildren = (group: GroupApiInterface, api: GroupsApiInterface) => ReactNode;

export interface GroupProps extends Omit<React.HTMLProps<HTMLDivElement>, 'children'> {
  name: string;
  defaultActive?: boolean;
  children: ReactNode | GroupApiChildren;
  displayAll?: boolean;
}

const { Provider, useStore } = createContext<GroupState>();

const GroupComponent = ({
  name,
  children,
  defaultActive,
  displayAll,
  style,
  uRef,
  ...props
}: PropsWithoutRef<GroupProps & FieldRefProp<HTMLDivElement>>) => {
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
      <div {...props} ref={uRef} style={newStyle}>
        {childrenComponent}
      </div>
    </Provider>
  );
};
GroupComponent.displayName = 'Group';

export const Group = GroupComponent;
export const useGroupStore = useStore;
