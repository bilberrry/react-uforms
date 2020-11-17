import { useTracked } from './reducer';
import { FieldErrorType, FieldInterface } from './types';
import _ from 'lodash';

const fieldApi = (state, dispatch) => (fieldId: string) => {
  const getField = (fieldId: string): FieldInterface | undefined =>
    state.fields.find(counter => counter.id === fieldId);
  const createField = (fieldId): FieldInterface => ({
    id: fieldId,
    isValidating: false,
    isDisabled: false,
    isTouched: false,
    isValid: true,
    value: _.get(state.defaultValues, fieldId),
    setters: [],
    getters: [],
    validators: [..._.get(state.defaultValidators, fieldId)],
    errors: [],
  });
  const getOrCreateField = (fieldId: string): FieldInterface => {
    const field = getField(fieldId);
    if (!field) {
      return createField(fieldId);
    }
    return field;
  };
  const api = {
    /* ========= Setter ========= */
    mountSetter(setterId: string): void {
      const field = getOrCreateField(fieldId);
      field.setters.push({
        id: setterId,
      });
      dispatch({ type: 'UPSERT_FIELD', field });
    },
    unmountSetter(setterId: string): void {
      const field = getOrCreateField(fieldId);
      field.setters = field.setters.filter(setter => setter.id !== setterId);
      dispatch({ type: 'UPSERT_FIELD', field });
    },
    /* ========= Getter ========= */
    mountGetter(getterId: string, callback: (value: any) => void) {
      const field = getOrCreateField(fieldId);
      field.getters.push({
        id: getterId,
        callback,
      });
      dispatch({ type: 'UPSERT_FIELD', field });
    },
    unmountGetter(getterId: string): void {
      const field = getOrCreateField(fieldId);
      field.setters = field.getters.filter(getter => getter.id !== getterId);
      dispatch({ type: 'UPSERT_FIELD', field });
    },
    /* ========= Field ========= */
    getObject(): FieldInterface | undefined {
      return getField(fieldId);
    },
    /* ========= Field Value ========= */
    getValue(): any {
      const field = getField(fieldId);
      return field?.value;
    },
    setValue(value: any): void {
      const field = getOrCreateField(fieldId);
      field.value = value;
      dispatch({ type: 'UPSERT_FIELD', field });
      // field.getters.forEach(getter => {
      //   getter.callback(value);
      // });
    },
    /* ========= Field Errors ========= */
    getErrors(): any {
      const field = getField(fieldId);
      return field?.errors;
    },
    addError(error: FieldErrorType): void {
      const field = getOrCreateField(fieldId);
      field.errors = [...field.errors, error];
      dispatch({ type: 'UPSERT_FIELD', field });
    },
    setErrors(errors: Array<FieldErrorType>): void {
      const field = getOrCreateField(fieldId);
      field.errors = [...errors];
      dispatch({ type: 'UPSERT_FIELD', field });
    },
    /* ========= Field Disabled ========= */
    isDisabled(): boolean {
      const field = getField(fieldId);
      return !!field?.isDisabled;
    },
    isTouched(): boolean {
      const field = getField(fieldId);
      return !!field?.isTouched;
    },
    isValid(): boolean {
      const field = getField(fieldId);
      return !!field?.isValid;
    },
    isValidating(): boolean {
      const field = getField(fieldId);
      return !!field?.isValidating;
    },
    async validate(): Promise<boolean> {
      const field = getOrCreateField(fieldId);
      dispatch({ type: 'MERGE_FIELD', id: field.id, data: { isValidating: true } });
      const errors = [];
      for (let i = 0; i < field.validators.length; i++) {
        const message = await field.validators[i].callback(field.value);
        if (message && typeof message === 'string') {
          errors.push(message);
        }
      }
      dispatch({ type: 'MERGE_FIELD', id: field.id, data: { isValidating: false, errors } });

      return errors.length === 0;
    },
  };

  return api;
};

export const useFieldApi = (fieldId: string) => {
  const [state, dispatch] = useTracked();

  return fieldApi(state, dispatch)(fieldId);
};

export const useFormApi = () => {
  const [state, dispatch] = useTracked();

  const api = {
    getField: fieldApi(state, dispatch),
    setDefaultValues: (values: any) => {
      dispatch({ type: 'SET_DEFAULT_VALUES', values });
    },
    setDefaultValidators: (validators: any) => {
      dispatch({ type: 'SET_DEFAULT_VALIDATORS', validators });
    },
  };

  return api;
};

/*

export interface FormApiInterface<Values extends ValuesType = ValuesType> {
  setTouched: (name: string, callback?: () => void) => void;
  setValue: (name: string, value: ValueType, callback?: () => void) => void;
  getValue: (name: string) => ValueType;
  removeValue: (name: string) => any;
  getValidator: (name: string) => ValidatorInterface[] | void;
  validate: (name: string) => ValidationErrorType | void;
  getErrors: (name: string) => ValidationErrorsInterface | ValidationErrorType;
  setErrors: (name: string, value: ValidationErrorType, callback?: () => void) => void;
  getClasses: <T extends keyof ClassesInterface>(name: keyof ClassesInterface) => ClassesInterface[T];
  getAllValues: () => Values;
  getAllErrors: () => ValidationErrorsInterface;
  setAllErrors: (errors: ValidationErrorsInterface, callback?: () => void) => void;
  setAllValues: (values: Values, callback?: () => void) => void;
  getAllDisabled: () => DisabledInterface;
  setDisabled: (name: string) => void;
  removeDisabled: (name: string) => void;
  isDisabled: (name: string) => boolean;
  getGroups: () => GroupsInterface;
  getGroup: (name: string) => GroupInterface | undefined;
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

 */
