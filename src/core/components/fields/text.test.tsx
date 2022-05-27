/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { Text } from './text';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <Text name="profile.firstName" />
    </Form>,
  );
  unmount();
});

test('change input value -> submit form', async () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <Text name="profile.firstName" data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  const form = getByTestId('input');
  expect(input).toHaveValue('');
  fireEvent.change(input, { target: { value: 'John' } });
  fireEvent.submit(form);
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
      firstName: 'John',
      lastName: 'Brown',
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} defaultValues={defaultValues} data-testid="form">
      <Text name="profile.firstName" data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  const form = getByTestId('input');
  expect(input).toHaveValue('John');
  fireEvent.change(input, { target: { value: 'Bill' } });
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          email: 'test@example.com',
          profile: {
            firstName: 'Bill',
            lastName: 'Brown',
          },
        },
      }),
    ),
  );
});

test('set emptyValue attribute -> change input value -> submit form', async () => {
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
      <Text name="profile.firstName" data-testid="input" emptyValue={null} />
    </Form>,
  );
  const input = getByTestId('input');
  const form = getByTestId('input');
  expect(input).toHaveValue('John');
  fireEvent.change(input, { target: { value: '' } });
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          email: 'test@example.com',
          profile: {
            firstName: null,
            lastName: 'Brown',
          },
        },
      }),
    ),
  );
});

test('set onChange attribute -> change input value ', () => {
  const change = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <Text name="profile.firstName" onChange={change} data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  fireEvent.change(input, { target: { value: 'John' } });
  expect(change).toHaveBeenCalled();
});

test('set onBlur attribute -> focus input -> blur input', async () => {
  const blur = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <Text name="profile.firstName" onBlur={blur} data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  input.focus();
  expect(input).toHaveFocus();
  input.blur();
  expect(input).not.toHaveFocus();
  await waitFor(() => expect(blur).toHaveBeenCalled());
});

test('set onStopTyping attribute -> change input value ', async () => {
  const stopTyping = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <Text name="profile.firstName" onStopTyping={stopTyping} data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  fireEvent.change(input, { target: { value: 'Jo' } });
  fireEvent.change(input, { target: { value: 'John' } });
  expect(stopTyping).not.toHaveBeenCalled();
  await new Promise((resolve) => setTimeout(resolve, 600));
  expect(stopTyping).toHaveBeenCalled();
});

test('set onStopTyping / stopTypingDelay attribute -> change input value ', async () => {
  const stopTyping = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <Text name="profile.firstName" onStopTyping={stopTyping} stopTypingDelay={1000} data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  fireEvent.change(input, { target: { value: 'Jo' } });
  fireEvent.change(input, { target: { value: 'John' } });
  expect(stopTyping).not.toHaveBeenCalled();
  await new Promise((resolve) => setTimeout(resolve, 600));
  expect(stopTyping).not.toHaveBeenCalled();
  await new Promise((resolve) => setTimeout(resolve, 500));
  expect(stopTyping).toHaveBeenCalled();
});
