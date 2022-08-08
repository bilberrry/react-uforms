/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
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
  act(() => {
    fireEvent.click(input);
    fireEvent.submit(form);
  });
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          profile: {
            firstName: 'John',
          },
        },
      }),
    ),
  );
});

test('set default values -> change input value -> submit form', async () => {
  const submit = jest.fn();
  const defaultValues = {
    email: 'test@example.com',
    profile: {
      isPublic: true,
      firstName: 'John',
      lastName: 'Brown',
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} defaultValues={defaultValues} data-testid="form">
      <Field name="profile.isPublic">
        {({ setValue, getValue }) => (
          <button type="button" onClick={() => setValue(!getValue())} data-testid="input">
            {getValue() ? 'on' : 'off'}
          </button>
        )}
      </Field>
    </Form>,
  );
  const input = getByTestId('input');
  const form = getByTestId('input');
  expect(input.innerHTML).toBe('on');
  act(() => {
    fireEvent.click(input);
    fireEvent.submit(form);
  });
  await waitFor(() => expect(input.innerHTML).toBe('off'));
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          email: 'test@example.com',
          profile: {
            isPublic: false,
            firstName: 'John',
            lastName: 'Brown',
          },
        },
      }),
    ),
  );
});
