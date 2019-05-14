import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';
import { Form, Checkbox } from '../../src';

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

test('check input -> submit form', () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <Checkbox name="profile.isPrivate" onValue offValue={false} data-testid="input" />
    </Form>,
  );
  fireEvent.click(getByTestId('input'));
  expect(getByTestId('input')).toHaveProperty('checked');
  fireEvent.submit(getByTestId('form'));
  expect(submit).toHaveBeenCalledWith(
    {
      profile: {
        isPrivate: true,
      },
    },
    expect.any(Object),
  );
});

test('set default values -> uncheck input -> submit form', () => {
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
  expect(getByTestId('input')).toHaveProperty('checked');
  fireEvent.click(getByTestId('input'));
  fireEvent.submit(getByTestId('form'));
  expect(submit).toHaveBeenCalledWith(
    {
      email: 'test@example.com',
      profile: {
        firstName: 'John',
        lastName: 'Brown',
        isPrivate: 0,
      },
    },
    expect.any(Object),
  );
});
