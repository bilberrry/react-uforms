/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, act } from '@testing-library/react'
import { Form, Text, Validator, FieldGroup, FormApiInterface } from '../index';

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

const BaseForm: React.FC<any> = () => {
  const [isHidden, hideGroup] = useState(false);
  return (
    <div>
      {!isHidden && (
        <FieldGroup name="group1">
          <Text name="profile.firstName" data-testid="inputFirstName" />
          <Text name="profile.middleName" data-testid="inputMiddleName" />
        </FieldGroup>
      )}
      <FieldGroup name="group2" defaultActive={true}>
        <Text name="profile.lastName" data-testid="inputLastName" />
      </FieldGroup>
      <button
        onClick={() => {
          hideGroup(true);
        }}
        data-testid="hideButton"
      >
        button
      </button>
    </div>
  );
};

const renderForm = (resolve: (api: FormApiInterface) => void) => {
  const validation = () => ({
    profile: {
      firstName: [Validator.Required()],
    },
  });
  const { getByTestId } = render(
    <Form onSubmit={() => {}} validation={validation} data-testid="form">
      {(api) => {
        resolve(api);
        return <BaseForm />;
      }}
    </Form>,
  );
  return getByTestId;
};

test('get groups', () => {
  let formApi: null | FormApiInterface = null;
  renderForm((api) => {
    formApi = api;
  });
  expect(formApi).not.toBeNull();
  expect((formApi as unknown as FormApiInterface).getGroups()).toEqual([
    {
      name: 'group1',
      hasErrors: false,
      isTouched: false,
      isActive: false,
      isCompleted: false,
      fields: ['profile.firstName', 'profile.middleName'],
    },
    {
      name: 'group2',
      hasErrors: false,
      isTouched: false,
      isCompleted: true,
      isActive: true,
      fields: ['profile.lastName'],
    },
  ]);
});

test('unmount group', async () => {
  let formApi: null | FormApiInterface = null;
  const getByTestId = renderForm((api) => {
    formApi = api;
  });
  const hideButton = getByTestId('hideButton');
  hideButton.click();
  await new Promise((resolve) => setTimeout(resolve, 300));
  expect((formApi as unknown as FormApiInterface).getGroups()).toEqual([
    {
      name: 'group2',
      hasErrors: false,
      isTouched: false,
      isCompleted: true,
      isActive: true,
      fields: ['profile.lastName'],
    },
  ]);
});

test('touch group', () => {
  let formApi: null | FormApiInterface = null;
  const getByTestId = renderForm((api) => {
    formApi = api;
  });
  const inputLastName = getByTestId('inputLastName');
  act(() => {
    inputLastName.focus();
    inputLastName.blur();
  });
  expect((formApi as unknown as FormApiInterface).getGroup('group2')).toMatchObject({
    isTouched: true,
  });
  expect((formApi as unknown as FormApiInterface).getGroup('group1')).toMatchObject({
    isTouched: false,
  });
  const inputMiddleName = getByTestId('inputMiddleName');
  act(() => {
    inputMiddleName.focus();
    inputMiddleName.blur();
  });
  expect((formApi as unknown as FormApiInterface).getGroup('group2')).toMatchObject({
    isTouched: true,
  });
  expect((formApi as unknown as FormApiInterface).getGroup('group1')).toMatchObject({
    isTouched: true,
  });
});

test('check errors - touch field with validator', () => {
  let formApi: null | FormApiInterface = null;
  const getByTestId = renderForm((api) => {
    formApi = api;
  });
  const inputFirstName = getByTestId('inputFirstName');
  act(() => {
    inputFirstName.focus();
    inputFirstName.blur();
  });
  expect((formApi as unknown as FormApiInterface).getGroup('group2')).toMatchObject({
    hasErrors: false,
  });
  expect((formApi as unknown as FormApiInterface).getGroup('group1')).toMatchObject({
    hasErrors: true,
  });
});

test('check errors - touch field without validator', () => {
  let formApi: null | FormApiInterface = null;
  const getByTestId = renderForm((api) => {
    formApi = api;
  });
  const inputMiddleName = getByTestId('inputMiddleName');
  act(() => {
    inputMiddleName.focus();
    inputMiddleName.blur();
  });
  expect((formApi as unknown as FormApiInterface).getGroup('group2')).toMatchObject({
    hasErrors: false,
  });
  expect((formApi as unknown as FormApiInterface).getGroup('group1')).toMatchObject({
    hasErrors: true,
  });
});

test('set active', () => {
  let formApi: null | FormApiInterface = null;
  renderForm((api) => {
    formApi = api;
  });
  act(() => {
    (formApi as unknown as FormApiInterface).setGroupActive('group1');
  });
  expect((formApi as unknown as FormApiInterface).getGroup('group2')).toMatchObject({
    isActive: false,
  });
  expect((formApi as unknown as FormApiInterface).getGroup('group1')).toMatchObject({
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
