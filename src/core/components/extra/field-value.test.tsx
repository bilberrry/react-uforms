/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { FieldValue } from './field-value';
import { Text } from '../fields/text';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <FieldValue names={['profile.firstName']}>{() => <>Some component</>}</FieldValue>
    </Form>,
  );
  unmount();
});

test('set default values -> change value', async () => {
  const defaultValues = {
    email: 'test@example.com',
    profile: {
      firstName: 'John',
      lastName: 'Brown',
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={() => {}} defaultValues={defaultValues} data-testid="form">
      <Text name="email" type="email" />
      <Text name="profile.firstName" data-testid="firstName" />
      <Text name="profile.lastName" data-testid="lastName" />
      <FieldValue names={['profile.lastName', 'profile.firstName']}>
        {(items) => <div data-testid="values">{items.join(' ')}</div>}
      </FieldValue>
    </Form>,
  );
  const values = getByTestId('values');
  expect(values.innerHTML).toBe('Brown John');
  const firstName = getByTestId('firstName');
  fireEvent.change(firstName, { target: { value: 'Bill' } });
  expect(values.innerHTML).toBe('Brown Bill');
});
