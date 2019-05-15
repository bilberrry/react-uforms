import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';
import { Form } from '../src';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <div />
    </Form>,
  );
  unmount();
});

test('submit form', () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <div />
    </Form>,
  );
  const form = getByTestId('form');
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalled();
});

test('set default values -> submit form', () => {
  const submit = jest.fn();
  const defaultValues = {
    email: 'test@example.com',
    profile: {
      firstName: 'John',
      lastName: 'Brown',
    },
  };
  const { getByTestId } = render(
    <Form defaultValues={defaultValues} onSubmit={submit} data-testid="form">
      <div />
    </Form>,
  );
  const form = getByTestId('form');
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledWith(defaultValues, expect.any(Object));
});
