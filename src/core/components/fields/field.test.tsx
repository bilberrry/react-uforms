/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { Field } from './field';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <Field name="profile.firstName">{() => <>Some component</>}</Field>
    </Form>,
  );
  unmount();
});

test('change input value -> submit form', async () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <Field name="profile.firstName">
        {({ setValue }) => (
          <button type="button" onClick={() => setValue('John')} data-testid="input">
            Some component
          </button>
        )}
      </Field>
    </Form>,
  );
  const input = getByTestId('input');
  const form = getByTestId('input');
  fireEvent.click(input);
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      profile: {
        firstName: 'John',
      },
    }),
  );
});

test('set default values -> change input value -> submit form', async () => {
  const submit = jest.fn();
  const defaultValues = {
    email: 'test@example.com',
    profile: {
      firstName: 'John',
      lastName: 'Brown',
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} defaultValues={defaultValues} data-testid="form">
      <Field name="profile.firstName">
        {({ setValue, getValue }) => (
          <button type="button" onClick={() => setValue('Bill')} data-testid="input">
            {getValue()}
          </button>
        )}
      </Field>
    </Form>,
  );
  const input = getByTestId('input');
  const form = getByTestId('input');
  expect(input.innerHTML).toBe('John');
  fireEvent.click(input);
  fireEvent.submit(form);
  await waitFor(() => expect(input.innerHTML).toBe('Bill'));
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      email: 'test@example.com',
      profile: {
        firstName: 'Bill',
        lastName: 'Brown',
      },
    }),
  );
});
