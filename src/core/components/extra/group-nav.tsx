import React, { ReactNode } from 'react';
import { useGroups } from '../../hooks';
import { FormApiInterface, GroupInterface } from '../../types';
import classNames from 'classnames';

export interface GroupNavProps extends Omit<React.HTMLProps<HTMLUListElement>, 'children'> {
  onClickGroup?: (formApi: FormApiInterface<unknown>, group: GroupInterface) => void;
  clickNext?: boolean;
  clickPrev?: boolean;
  childNode?: (group: GroupInterface) => ReactNode;
}

const GroupNavComponent: React.FC<GroupNavProps> = ({ onClickGroup, clickNext, clickPrev, childNode, ...props }) => {
  const [groups, formApi] = useGroups();
  const { active, valid, touched, disabled } = formApi.getClasses().fieldGroup;
  return (
    <ul {...props}>
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
              onClickGroup(formApi, group);
            }
            if ((groupIndex < activeIndex && clickPrev) || (groupIndex > activeIndex && clickNext)) {
              formApi.getGroup(group.name)?.setActive();
            }
          }}
        >
          {childNode ? childNode(group) : group.name}
        </li>
      ))}
    </ul>
  );
};

GroupNavComponent.displayName = 'GroupNav';

export const GroupNav = GroupNavComponent;
