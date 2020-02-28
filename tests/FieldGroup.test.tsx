/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Form, FieldError, Text, Validator, FieldGroup, FormApiInterface } from '../src';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <FieldGroup name="group1">
        <Text name="profile.firstName" />
      </FieldGroup>
    </Form>,
  );
  unmount();
});

test('get groups | touch group | set active', () => {
  const validation = () => ({
    profile: {
      firstName: [Validator.Required()],
    },
  });
  let formApi: null | FormApiInterface = null;
  const { getByTestId } = render(
    <Form onSubmit={() => {}} validation={validation} data-testid="form">
      {api => {
        formApi = api;
        return (
          <>
            <FieldGroup name="group1">
              <Text name="profile.firstName" data-testid="inputFirstName" />
              <Text name="profile.middleName" data-testid="inputMiddleName" />
            </FieldGroup>
            <FieldGroup name="group2" defaultActive={true}>
              <Text name="profile.lastName" data-testid="inputLastName" />
            </FieldGroup>
          </>
        );
      }}
    </Form>,
  );
  const form = getByTestId('form');
  //fireEvent.submit(form);
  expect(formApi).not.toBeNull();
  expect(((formApi as unknown) as FormApiInterface).getGroups()).toEqual({
    group1: {
      name: 'group1',
      hasErrors: false,
      isTouched: false,
      isActive: false,
      fields: ['profile.firstName', 'profile.middleName'],
    },
    group2: {
      name: 'group2',
      hasErrors: false,
      isTouched: false,
      isActive: true,
      fields: ['profile.lastName'],
    },
  });
  const inputLastName = getByTestId('inputLastName');
  inputLastName.focus();
  inputLastName.blur();
  expect(((formApi as unknown) as FormApiInterface).getGroup('group2')).toMatchObject({
    isTouched: true,
    hasErrors: false,
  });
  expect(((formApi as unknown) as FormApiInterface).getGroup('group1')).toMatchObject({
    isTouched: false,
    hasErrors: false,
  });
  const inputMiddleName = getByTestId('inputMiddleName');
  inputMiddleName.focus();
  inputMiddleName.blur();
  expect(((formApi as unknown) as FormApiInterface).getGroup('group2')).toMatchObject({
    isTouched: true,
    hasErrors: false,
  });
  expect(((formApi as unknown) as FormApiInterface).getGroup('group1')).toMatchObject({
    isTouched: true,
    hasErrors: false,
  });
  const inputFirstName = getByTestId('inputFirstName');
  inputFirstName.focus();
  inputFirstName.blur();
  expect(((formApi as unknown) as FormApiInterface).getGroup('group2')).toMatchObject({
    isTouched: true,
    hasErrors: false,
  });
  expect(((formApi as unknown) as FormApiInterface).getGroup('group1')).toMatchObject({
    isTouched: true,
    hasErrors: true,
  });
  ((formApi as unknown) as FormApiInterface).setGroupActive('group1');
  expect(((formApi as unknown) as FormApiInterface).getGroup('group2')).toMatchObject({
    isTouched: true,
    hasErrors: false,
    isActive: false,
  });
  expect(((formApi as unknown) as FormApiInterface).getGroup('group1')).toMatchObject({
    isTouched: true,
    hasErrors: true,
    isActive: true,
  });
});

test('without form', () => {
  const log = jest.spyOn(global.console, 'error');
  render(
    <FieldGroup name="group1">
      <div />
    </FieldGroup>,
  );
  expect(log).toHaveBeenCalledWith('Could not found Form API. Make sure <FieldGroup/> is in the <Form/>.');
});
