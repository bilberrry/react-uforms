import React, { ReactNode, useContext, useEffect } from 'react';
import { ContextApi, ContextFieldGroup } from './form-context';
export interface FieldGroupProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  defaultActive?: boolean;
  children: ReactNode;
}

const FieldGroupComponent: React.FC<FieldGroupProps> = ({ name, children, defaultActive, style, ...props }) => {
  const api = useContext(ContextApi);
  if (!api) {
    console.error(`Could not found Form API. Make sure <FieldGroup/> is in the <Form/>.`);
    return null;
  }
  useEffect(() => {
    api.upsertGroup(name, { isActive: !!defaultActive });
    return () => {
      api.removeGroup(name);
    };
  }, [name]);
  const group = api.getGroup(name);
  const isVisible = group ? group.isActive : defaultActive;
  const newStyle = {
    ...style,
    ...(isVisible ? {} : { visibility: 'hidden' }),
  };
  return (
    <ContextFieldGroup.Provider value={name}>
      <div style={newStyle} {...props}>
        {children}
      </div>
    </ContextFieldGroup.Provider>
  );
};

FieldGroupComponent.displayName = 'FieldGroup';

export const FieldGroup = FieldGroupComponent;
