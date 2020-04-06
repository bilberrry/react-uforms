import React, { CSSProperties, ReactNode, useContext, useEffect } from 'react';
import { ContextApi, ContextFieldGroup } from './form-context';
export interface FieldGroupProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  defaultActive?: boolean;
  children: ReactNode;
  renderOnActive?: boolean;
  touchOnActive?: boolean;
}

const FieldGroupComponent: React.FC<FieldGroupProps> = ({
  name,
  children,
  defaultActive,
  style,
  renderOnActive,
  touchOnActive,
  ...props
}) => {
  const api = useContext(ContextApi);
  if (!api) {
    console.error(`Could not found Form API. Make sure <FieldGroup/> is in the <Form/>.`);
    return null;
  }
  useEffect(() => {
    api.upsertGroup(name, { isActive: !!defaultActive, isTouched: !!touchOnActive });
    return () => {
      api.removeGroup(name);
    };
  }, [name]);
  const group = api.getGroup(name);
  const isVisible = group ? group.isActive : defaultActive;
  const newStyle: CSSProperties = {
    ...style,
    ...(isVisible ? {} : { display: 'none' }),
  };
  return (
    <ContextFieldGroup.Provider value={name}>
      <div style={renderOnActive ? style : newStyle} {...props}>
        {renderOnActive && !isVisible ? null : children}
      </div>
    </ContextFieldGroup.Provider>
  );
};

FieldGroupComponent.displayName = 'FieldGroup';

export const FieldGroup = FieldGroupComponent;
