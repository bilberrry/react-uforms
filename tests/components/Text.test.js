import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';
import { Form, Text } from '../../src';

afterEach(() => {
  cleanup();
});

test('change value and submit', () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <Text name="profile.firstName" data-testid="input" />
    </Form>,
  );
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

test('set default values, change and submit', () => {
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
