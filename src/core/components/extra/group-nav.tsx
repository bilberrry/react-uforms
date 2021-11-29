import React, { ReactNode } from 'react';
import { useGroups } from '../../hooks';
import { GroupApiInterface, GroupsApiInterface } from '../../types';
import classNames from 'classnames';

export interface GroupNavProps extends Omit<React.HTMLProps<HTMLUListElement>, 'children'> {
  onClickGroup?: (group: GroupApiInterface, api: GroupsApiInterface) => void;
  clickNext?: boolean;
  clickPrev?: boolean;
  childNode?: (group: GroupApiInterface, api: GroupsApiInterface) => ReactNode;
}

const GroupNavComponent = React.forwardRef<HTMLUListElement, GroupNavProps>(
  ({ onClickGroup, clickNext, clickPrev, childNode, ...props }, ref) => {
    const [groups, groupsApi] = useGroups();
    const { active, valid, touched, disabled } = groupsApi.getClasses();
    return (
      <ul {...props} ref={ref}>
        {groups.map((group) => (
          <li
            key={group.name}
            className={classNames({
              [active]: group.isActive,
              [valid]: group.isValid,
              [touched]: group.isTouched,
              [disabled]: group.isDisabled,
            })}
            onClick={() => {
              const groupIndex = groups.findIndex((item) => item.name === group.name);
              const activeIndex = groups.findIndex((item) => item.isActive);
              if (onClickGroup) {
                onClickGroup(groupsApi.getGroup(group.name) as GroupApiInterface, groupsApi);
              }
              if ((groupIndex < activeIndex && clickPrev) || (groupIndex > activeIndex && clickNext)) {
                groupsApi.getGroup(group.name)?.setActive();
              }
            }}
          >
            {childNode ? childNode(groupsApi.getGroup(group.name) as GroupApiInterface, groupsApi) : group.name}
          </li>
        ))}
      </ul>
    );
  },
);

GroupNavComponent.displayName = 'GroupNav';

export const GroupNav = GroupNavComponent;
