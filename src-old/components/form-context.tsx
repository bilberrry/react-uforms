import { createContext } from 'react';
import { FormApiInterface, FormState } from './form';
import { RadioGroupApi } from './fields/radio-group';
import { CheckboxGroupApi } from './fields/checkbox-group';

export const ContextApi = createContext<FormApiInterface<any> | undefined>(undefined);
export const ContextForm = createContext<FormState | undefined>(undefined);
export const ContextRadioGroup = createContext<RadioGroupApi | undefined>(undefined);
export const ContextCheckboxGroup = createContext<CheckboxGroupApi | undefined>(undefined);
export const ContextFieldGroup = createContext<string | undefined>(undefined);
