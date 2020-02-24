import React, { ReactNode, useEffect } from 'react';
import { ContextApi, ContextFieldGroup } from './form-context';
export interface FieldGroupProps {
  name: string;
  children: ReactNode;
}

const FieldGroupComponent: React.FC<FieldGroupProps> = ({ name, children }) => {
  return (
    <ContextApi.Consumer>
      {api => {
        if (!api) {
          console.error(`Could not found Form API. Make sure <FieldGroup/> is in the <Form/>.`);
          return null;
        }
        useEffect(() => {
          api.addGroup(name);
          return () => {
            api.removeGroup(name);
          };
        }, [name]);
        return <ContextFieldGroup.Provider value={name}>{children}</ContextFieldGroup.Provider>;
      }}
    </ContextApi.Consumer>
  );
};

FieldGroupComponent.displayName = 'FieldGroup';

export const FieldGroup = FieldGroupComponent;
