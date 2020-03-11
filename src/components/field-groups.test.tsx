/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import { Form, Text, Validator, FieldGroup, FormApiInterface, FieldGroups } from '../index';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <FieldGroups />
      <FieldGroup name="group1">
        <Text name="profile.firstName" />
      </FieldGroup>
    </Form>,
  );
  unmount();
});

const renderForm = () => {
  const validation = () => ({
    profile: {
      firstName: [Validator.Required()],
    },
  });
  return render(
    <Form onSubmit={() => {}} validation={validation} data-testid="form">
      <>
        <FieldGroups data-testid="groups" />
        <FieldGroup name="group1">
          <Text name="profile.firstName" data-testid="inputFirstName" />
          <Text name="profile.middleName" data-testid="inputMiddleName" />
        </FieldGroup>
        <FieldGroup name="group2" defaultActive={true}>
          <Text name="profile.lastName" data-testid="inputLastName" />
        </FieldGroup>
      </>
    </Form>,
  );
};

test('render groups', () => {
  const { getByText } = renderForm();
  const group1 = getByText('group1');
  const group2 = getByText('group2');
  expect(group1).toBeInTheDocument();
  expect(group2).toBeInTheDocument();
});

// TODO add more tests
