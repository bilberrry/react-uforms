import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';
import { Form, Text } from '../../src';

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

test('change input value -> submit form', () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <Text name="profile.firstName" data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  const form = getByTestId('input');
  expect(input.value).toBe('');
  fireEvent.change(input, { target: { value: 'John' } });
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledWith(
    {
      profile: {
        firstName: 'John',
      },
    },
    expect.any(Object),
  );
});

test('set default values -> change input value -> submit form', () => {
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
  expect(input.value).toBe('John');
  fireEvent.change(input, { target: { value: 'Bill' } });
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledWith(
    {
      email: 'test@example.com',
      profile: {
        firstName: 'Bill',
        lastName: 'Brown',
      },
    },
    expect.any(Object),
  );
});

test('set emptyValue attribute -> change input value -> submit form', () => {
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
  expect(input.value).toBe('John');
  fireEvent.change(input, { target: { value: '' } });
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledWith(
    {
      email: 'test@example.com',
      profile: {
        firstName: null,
        lastName: 'Brown',
      },
    },
    expect.any(Object),
  );
});

test('set onChange attribute -> change input value ', async () => {
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

test('set onBlur attribute -> focus input -> blur input', () => {
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
  expect(blur).toHaveBeenCalled();
});
