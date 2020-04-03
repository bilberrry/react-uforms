import React from 'react';
import { ContextCheckboxGroup } from '../form-context';
import { valueToJson } from '../helpers';

export interface CheckboxGroupItemProps extends Omit<React.HTMLProps<HTMLInputElement>, 'value'> {
  value: string | number | boolean | {} | null;
}

const CheckboxGroupItemComponent: React.FC<CheckboxGroupItemProps> = ({ value, onBlur, ...props }) => (
  <ContextCheckboxGroup.Consumer>
    {checkboxApi => {
      if (!checkboxApi) {
        console.error('Could not found Checkbox Group API. Make sure <CheckboxGroupItem/> is in the <CheckboxGroup/>.');
        return null;
      }

      const { name, getValue, setTouched, onChange } = checkboxApi;
      const checked = getValue() || [];
      return (
        <input
          {...props}
          name={name}
          value={valueToJson(value)}
          checked={checked.length > 0 && getValue().includes(value)}
          type="checkbox"
          onChange={onChange}
          onBlur={event => {
            event.persist();
            setTouched(() => {
              if (onBlur) {
                onBlur(event);
              }
            });
          }}
        />
      );
    }}
  </ContextCheckboxGroup.Consumer>
);

CheckboxGroupItemComponent.displayName = 'CheckboxGroupItem';

export const CheckboxGroupItem = CheckboxGroupItemComponent;
