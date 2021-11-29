/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { Checkbox } from './checkbox';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <Checkbox name="profile.isPrivate" onValue={0} offValue={1} />
    </Form>,
  );
  unmount();
});

test('check input -> submit form', async () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <Checkbox name="profile.isPrivate" onValue offValue={false} data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  const form = getByTestId('form');
  fireEvent.click(input);
  expect(input).toHaveProperty('checked');
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      profile: {
        isPrivate: true,
      },
    }),
  );
});

test('set default values -> uncheck input -> submit form', async () => {
  const submit = jest.fn();
  const defaultValues = {
    email: 'test@example.com',
    profile: {
      firstName: 'John',
      lastName: 'Brown',
      isPrivate: 1,
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} defaultValues={defaultValues} data-testid="form">
      <Checkbox name="profile.isPrivate" onValue={1} offValue={0} data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  const form = getByTestId('form');
  expect(input).toHaveProperty('checked');
  fireEvent.click(input);
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      email: 'test@example.com',
      profile: {
        firstName: 'John',
        lastName: 'Brown',
        isPrivate: 0,
      },
    }),
  );
});

test('set onChange attribute -> change input value ', async () => {
  const change = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <Checkbox name="profile.isPrivate" onValue={1} offValue={0} onChange={change} data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  fireEvent.click(input);
  await waitFor(() => expect(change).toHaveBeenCalled());
});

test('set onBlur attribute -> focus input -> blur input', async () => {
  const blur = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <Checkbox name="profile.isPrivate" onValue={1} offValue={0} onBlur={blur} data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  input.focus();
  expect(input).toHaveFocus();
  input.blur();
  expect(input).not.toHaveFocus();
  await waitFor(() => expect(blur).toHaveBeenCalled());
});
