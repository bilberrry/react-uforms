import React, { Fragment } from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';
import { Form, Text } from '../src';

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

test('set default values -> change input -> submit form -> get values difference', () => {
  const defaultValues = {
    id: 2,
    email: 'foo@example.com',
    profile: {
      firstName: 'John',
      lastName: 'Brown',
      bio: 'Travel Blogger',
    },
    createdAt: '2018-04-25T20:36:02+00:00',
  };
  let diffValues = null;
  let diffValuesLevel1 = null;
  const submit = (values, { getValuesDiff }) => {
    diffValues = getValuesDiff();
    diffValuesLevel1 = getValuesDiff(1);
  };
  const { getByTestId } = render(
    <Form defaultValues={defaultValues} onSubmit={submit} data-testid="form">
      <Text name="id" disabled />
      <Text name="email" data-testid="email" />
      <Text name="profile.firstName" data-testid="first-name" />
      <Text name="profile.lastName" />
    </Form>,
  );
  const form = getByTestId('form');
  const email = getByTestId('email');
  const firstName = getByTestId('first-name');
  fireEvent.submit(form);
  expect(diffValues).toEqual({});
  fireEvent.change(email, { target: { value: 'bar@example.com' } });
  fireEvent.submit(form);
  expect(diffValues).toEqual({ email: 'bar@example.com' });
  fireEvent.change(firstName, { target: { value: 'Bill' } });
  fireEvent.submit(form);
  expect(diffValues).toEqual({
    email: 'bar@example.com',
    profile: {
      firstName: 'Bill',
    },
  });
  expect(diffValuesLevel1).toEqual({
    email: 'bar@example.com',
    profile: {
      firstName: 'Bill',
      lastName: 'Brown',
      bio: 'Travel Blogger',
    },
  });
});

test('submit form -> ensure field is disabled ', () => {
  let isInputDisabled = null;
  const submit = (values, { isDisabled }) => {
    isInputDisabled = isDisabled('profile.firstName');
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <Text name="profile.firstName" data-testid="input" disabled />
    </Form>,
  );
  const form = getByTestId('form');
  const input = getByTestId('input');
  expect(input).toHaveProperty('disabled');
  fireEvent.submit(form);
  expect(isInputDisabled).toBe(true);
});

test('change input -> unsure hasChanges is true ', () => {
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      {({ hasChanges }) => (
        <Fragment>
          <Text name="profile.firstName" data-testid="input" />
          <button type="submit" disabled={!hasChanges()} data-testid="button" />
        </Fragment>
      )}
    </Form>,
  );
  const input = getByTestId('input');
  const button = getByTestId('button');
  expect(button).toHaveAttribute('disabled');
  fireEvent.change(input, { target: { value: 'Bill' } });
  expect(button).not.toHaveAttribute('disabled');
});
