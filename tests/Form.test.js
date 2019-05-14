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
  const { container } = render(
    <Form onSubmit={submit}>
      <div />
    </Form>,
  );
  fireEvent.submit(container.firstChild);
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
  const { container } = render(
    <Form defaultValues={defaultValues} onSubmit={submit}>
      <div />
    </Form>,
  );
  fireEvent.submit(container.firstChild);
  expect(submit).toHaveBeenCalledWith(defaultValues, expect.any(Object));
});
