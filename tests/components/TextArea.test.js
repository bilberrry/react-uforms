import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';
import { Form, TextArea } from '../../src';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <TextArea name="profile.firstName" />
    </Form>,
  );
  unmount();
});

test('change input value -> submit form', () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <TextArea name="profile.firstName" data-testid="input" />
    </Form>,
  );
  expect(getByTestId('input').value).toBe('');
  fireEvent.change(getByTestId('input'), { target: { value: 'John' } });
  fireEvent.submit(getByTestId('form'));
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
      <TextArea name="profile.firstName" data-testid="input" />
    </Form>,
  );
  expect(getByTestId('input').value).toBe('John');
  fireEvent.change(getByTestId('input'), { target: { value: 'Bill' } });
  fireEvent.submit(getByTestId('form'));
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
      <TextArea name="profile.firstName" data-testid="input" emptyValue={null} />
    </Form>,
  );
  expect(getByTestId('input').value).toBe('John');
  fireEvent.change(getByTestId('input'), { target: { value: '' } });
  fireEvent.submit(getByTestId('form'));
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
