import React, { FormEvent, ReactElement, ReactNode } from 'react';
import _ from 'lodash';
import { ContextApi, ContextForm } from './form-context';
import { getValuesDiff } from './helpers';
import { ValidatorInterface, ValueType } from './validator';

export interface ValuesInterface {
  [key: string]: ValueType | ValuesInterface;
}

export type ValuesType = ValuesInterface | {};

export type ValidationErrorType = string[];

export interface ValidationErrorsInterface {
  [key: string]: ValidationErrorType | ValidationErrorsInterface;
}

export interface ValidationResultInterface {
  count: number;
  errors: ValidationErrorsInterface;
}

export interface ValidationRulesInterface {
  [key: string]: ValidatorInterface[] | ValidationRulesInterface;
}

export type DisabledInterface = string[];

export interface GroupsInterface {
  [key: string]: GroupInterface;
}

export interface GroupInterface {
  name: string;
  hasErrors: boolean;
  isTouched: boolean;
  isActive: boolean;
  fields: string[];
}

export interface FormApiInterface<Values extends ValuesType = ValuesType> {
  setTouched: (name: string, callback?: () => void) => void;
  setValue: (name: string, value: ValueType, callback?: () => void) => void;
  getValue: (name: string) => ValueType;
  removeValue: (name: string) => any;
  getErrors: (name: string) => ValidationErrorsInterface | ValidationErrorType;
  setErrors: (name: string, value: ValidationErrorType, callback?: () => void) => void;
  getErrorClass: () => string | undefined;
  getInvalidClass: () => string | undefined;
  getAllValues: () => Values;
  getAllErrors: () => ValidationErrorsInterface;
  setAllErrors: (errors: ValidationErrorsInterface, callback?: () => void) => void;
  setAllValues: (values: Values, callback?: () => void) => void;
  getAllDisabled: () => DisabledInterface;
  setDisabled: (name: string) => void;
  removeDisabled: (name: string) => void;
  isDisabled: (name: string) => boolean;
  getGroups: () => GroupsInterface;
  getGroup: (name: string) => GroupInterface;
  getGroupByField: (name: string) => GroupInterface | undefined;
  upsertGroup: (name: string, params: Partial<GroupInterface>, addField?: string, removeField?: string) => void;
  removeGroup: (name: string) => void;
  setGroupTouched: (name: string) => void;
  setGroupActive: (name: string) => void;
  hasGroupErrors: (name: string) => boolean;
  addFieldToGroup: (groupName: string, fieldName: string) => void;
  removeFieldFromGroup: (groupName: string, fieldName: string) => void;
  getValuesDiff: (maxLevel?: number) => Partial<Values>;
  hasChanges: () => boolean;
  submit: () => void;
}

export interface FormProps<Values>
  extends Omit<React.HTMLProps<HTMLFormElement>, 'onChange' | 'onSubmit' | 'onError' | 'defaultValues'> {
  children: ((api: FormApiInterface<Values>) => ReactElement) | ReactElement | ReactElement[];
  onSubmit: (values: Values, api: FormApiInterface<Values>) => void;
  defaultValues?: Values;
  onChange?: (api: FormApiInterface<Values>) => void;
  onTouch?: (api: FormApiInterface<Values>) => void;
  onError?: (errors: ValidationErrorsInterface, api: FormApiInterface<Values>) => void;
  validation?: (api: FormApiInterface<Values>) => ValidationRulesInterface;
  errorClass?: string;
  invalidClass?: string;
}

export interface FormState<Values extends ValuesType = ValuesType> {
  values: Values;
  errors: ValidationErrorsInterface;
  disabled: DisabledInterface;
  groups: GroupsInterface;
}

export class Form<Values extends ValuesType = ValuesType> extends React.Component<
  FormProps<Values>,
  FormState<Values>
> {
  static defaultProps = {
    defaultValues: {},
    onError: undefined,
    onChange: undefined,
    validation: undefined,
    invalidClass: 'is-invalid',
    errorClass: 'invalid-feedback',
  };

  constructor(props: any) {
    super(props);
    const { defaultValues } = props;
    this.state = {
      values: _.cloneDeep(defaultValues),
      errors: {},
      disabled: [],
      groups: {},
    };
  }

  validateValue = (validators: ValidatorInterface[], value: ValueType): string[] => {
    const errors: string[] = [];

    validators.forEach(v => {
      const result = v(value);
      if (typeof result === 'string') {
        errors.push(result);
      }
    });

    return errors;
  };

  validateForm = (result: ValidationResultInterface, obj: ValidationRulesInterface, path: string[] = []): void => {
    Object.keys(obj).forEach(i => {
      const currentPath: string[] = [...path, i];
      const validator = obj[i];
      if (Array.isArray(validator)) {
        const value = this.api.getValue(currentPath.join('.'));
        const error = this.validateValue(validator, value);
        if (error && error.length > 0) {
          // eslint-disable-next-line no-param-reassign
          result.count += 1;
          _.set(result.errors, currentPath, error);
        }
      } else if (typeof validator === 'object' && validator !== null) {
        this.validateForm(result, validator, currentPath);
      }
    });
  };

  onSubmit = (event: FormEvent): void => {
    if (event) {
      event.preventDefault();
    }
    this.api.submit();
  };

  api: FormApiInterface<Values> = {
    setTouched: (name: string, callback?: () => void): void => {
      const { validation, onTouch } = this.props;
      const group = this.api.getGroupByField(name);
      const combinedCallback = () => {
        if (onTouch) {
          onTouch(this.api);
        }
        if (callback) {
          callback();
        }
        if (group && !group.isTouched) {
          this.api.setGroupTouched(group.name);
        }
      };

      if (!validation) {
        combinedCallback();
        return;
      }
      const validators = _.get(validation(this.api), name);
      if (validators && Array.isArray(validators) && validators.length > 0) {
        this.setState(({ errors, values }) => {
          const value = _.get(values, name);
          _.set(errors, name, this.validateValue(validators, value));
          return {
            errors,
            values,
          };
        }, combinedCallback);
      } else {
        combinedCallback();
      }
    },
    setValue: (name: string, value: ValueType, callback?: () => void): void => {
      const { onChange } = this.props;

      this.setState(
        ({ errors, values }) => {
          _.set(values, name, value);
          _.set(errors, name, []);
          return {
            values,
            errors,
          };
        },
        () => {
          if (onChange) {
            onChange(this.api);
          }
          if (callback) {
            callback();
          }
        },
      );
    },
    getValue: (name: string): ValueType => {
      const { values } = this.state;
      return _.get(values, name);
    },
    removeValue: (name: string): any => {
      const { values } = this.state;
      return _.omit(values, name);
    },
    getErrors: (name: string): ValidationErrorsInterface | ValidationErrorType => {
      const { errors } = this.state;
      return _.get(errors, name);
    },
    setErrors: (name: string, value: ValidationErrorType, callback?: () => void): void => {
      this.setState(({ errors }) => {
        _.set(errors, name, value);
        return {
          errors,
        };
      }, callback);
    },
    getErrorClass: (): string | undefined => {
      const { errorClass } = this.props;
      return errorClass;
    },
    getInvalidClass: (): string | undefined => {
      const { invalidClass } = this.props;
      return invalidClass;
    },
    getAllValues: (): Values => {
      const { values } = this.state;
      return values;
    },
    getAllErrors: (): ValidationErrorsInterface => {
      const { errors } = this.state;
      return errors;
    },
    setAllErrors: (errors: ValidationErrorsInterface, callback?: () => void): void => {
      this.setState(
        {
          errors,
        },
        callback,
      );
    },
    setAllValues: (values: Values, callback?: () => void): void => {
      this.setState(
        {
          values,
        },
        callback,
      );
    },
    getAllDisabled: (): DisabledInterface => {
      const { disabled } = this.state;
      return disabled;
    },
    setDisabled: (name: string): void => {
      const { disabled } = this.state;

      if (!disabled.includes(name)) {
        this.setState({ disabled: [...disabled, name] });
      }
    },
    removeDisabled: (name: string): void => {
      const { disabled } = this.state;

      if (disabled.includes(name)) {
        this.setState({ disabled: disabled.filter(i => i !== name) });
      }
    },
    isDisabled: (name: string): boolean => {
      const { disabled } = this.state;
      return disabled.includes(name);
    },
    getGroups: () => {
      const { groups } = this.state;
      return groups;
    },
    getGroup: (name: string) => {
      const { groups } = this.state;
      return groups[name];
    },
    getGroupByField: (name: string) => {
      const { groups } = this.state;
      for (const [, group] of Object.entries(groups)) {
        if (group.fields.includes(name)) {
          return group;
        }
      }
    },
    upsertGroup: (name: string, params: Partial<GroupInterface> = {}, addField?: string, removeField?: string) => {
      this.setState(({ groups }) => {
        const { [name]: selectedGroup, ...restGroups } = groups;
        const group: GroupInterface = selectedGroup || {
          name,
          isActive: false,
          hasErrors: false,
          isTouched: false,
          fields: [],
        };
        let updatedRestGroups: GroupsInterface = restGroups;
        let updatedGroup: GroupInterface = {
          ...group,
          ...params,
        };
        if (addField) {
          updatedGroup = {
            ...updatedGroup,
            fields: [...updatedGroup.fields, addField],
          };
        }
        if (removeField) {
          updatedGroup = {
            ...updatedGroup,
            fields: updatedGroup.fields.filter(i => i !== removeField),
          };
        }
        if (!group.isActive && updatedGroup.isActive) {
          updatedRestGroups = Object.entries(updatedRestGroups).reduce(
            (acc, [k, g]) => ({
              ...acc,
              [k]: {
                ...g,
                isActive: false,
              },
            }),
            {},
          );
        }
        if (updatedGroup.isTouched) {
          for (const i in updatedGroup.fields) {
            const fieldErrors = this.api.getErrors(updatedGroup.fields[i]);
            if (fieldErrors && fieldErrors.length > 0) {
              updatedGroup = {
                ...updatedGroup,
                hasErrors: true,
              };
              break;
            }
          }
        }

        return {
          groups: {
            ...updatedRestGroups,
            [name]: updatedGroup,
          },
        };
      });
    },
    removeGroup: (name: string) => {
      this.setState(({ groups }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [name]: selectedGroup, ...rest } = groups;
        return {
          groups: rest,
        };
      });
    },
    setGroupTouched: (name: string) => {
      this.api.upsertGroup(name, { isTouched: true });
    },
    setGroupActive: (name: string) => {
      this.api.upsertGroup(name, { isActive: true });
    },
    hasGroupErrors: (name: string) => {
      const group = this.api.getGroup(name);
      return group ? group.hasErrors : false;
    },
    addFieldToGroup: (groupName: string, fieldName: string) => {
      this.api.upsertGroup(groupName, {}, fieldName);
    },
    removeFieldFromGroup: (groupName: string, fieldName: string) => {
      this.api.upsertGroup(groupName, {}, undefined, fieldName);
    },
    getValuesDiff: (maxLevel): Partial<Values> => {
      const { defaultValues } = this.props;
      const { values } = this.state;
      return getValuesDiff(defaultValues, values, maxLevel);
    },
    hasChanges: (): boolean => !!Object.keys(this.api.getValuesDiff()).length,
    submit: (): void => {
      const { validation, onError, onSubmit } = this.props;
      const { values } = this.state;
      const result: ValidationResultInterface = {
        count: 0,
        errors: {},
      };
      if (validation) {
        this.validateForm(result, validation(this.api));
      }
      this.setState(
        {
          errors: result.errors,
        },
        () => {
          if (result.count && onError) {
            onError(result.errors, this.api);
          } else if (!result.count) {
            onSubmit(_.cloneDeep(values), this.api);
          }
        },
      );
    },
  };

  render() {
    const {
      children,
      defaultValues,
      onSubmit,
      onError,
      onChange,
      onTouch,
      validation,
      errorClass,
      invalidClass,
      ...props
    } = this.props;
    return (
      <ContextApi.Provider value={this.api}>
        <ContextForm.Provider value={this.state}>
          <form {...props} onSubmit={this.onSubmit}>
            {typeof children === 'function' ? children(this.api) : children}
          </form>
        </ContextForm.Provider>
      </ContextApi.Provider>
    );
  }
}
