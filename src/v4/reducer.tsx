import { Reducer, useReducer } from 'react';
import { createContainer } from 'react-tracked';
import { FieldInterface, FormStateInterface } from './types';

const initialState: FormStateInterface = {
  defaultValidators: {},
  defaultValues: {},
  fields: [],
  isValidating: false,
  isTouched: false,
  isValid: true,
};

type Action =
  | { type: 'UPSERT_FIELD'; field: FieldInterface }
  | { type: 'MERGE_FIELD'; id: string; data: Partial<FieldInterface> }
  | { type: 'SET_VALIDATING'; value: boolean }
  | { type: 'SET_TOUCHED'; value: boolean }
  | { type: 'SET_VALID'; value: boolean }
  | { type: 'SET_DEFAULT_VALIDATORS'; validators: any }
  | { type: 'SET_DEFAULT_VALUES'; values: any }
  | { type: 'RESET' };

const initState = is => is;

const reducer: Reducer<FormStateInterface, Action> = (state, action) => {
  switch (action.type) {
    case 'UPSERT_FIELD':
      let isUpdated = false;
      const fields = state.fields.map(item => {
        if (item.id === action.field.id) {
          isUpdated = true;
          return action.field;
        }
        return item;
      });
      return {
        ...state,
        fields: isUpdated ? fields : [...fields, action.field],
      };
    case 'MERGE_FIELD':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.id === action.id) {
            return {
              ...item,
              ...action.data,
            };
          }
          return item;
        }),
      };
    case 'SET_VALIDATING':
      return {
        ...state,
        isValidating: action.value,
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        isTouched: action.value,
      };
    case 'SET_VALID':
      return {
        ...state,
        isValid: action.value,
      };
    case 'SET_DEFAULT_VALIDATORS':
      return {
        ...state,
        defaultValidators: action.validators,
      };
    case 'SET_DEFAULT_VALUES':
      return {
        ...state,
        defaultValues: action.values,
      };
    case 'RESET':
      return initState(initialState);
    default:
      throw new Error(`unknown action type`);
  }
};

const useValue = () => useReducer(reducer, initialState, initState);

export const { Provider, useTracked } = createContainer(useValue);
