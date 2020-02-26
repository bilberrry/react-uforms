/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Fragment } from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { FieldError, Form, Text, Validator } from '../src';

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
  const { getByTestId } = render(
    <Form
      defaultValues={defaultValues}
      onSubmit={(_, api) => {
        diffValues = api.getValuesDiff();
        diffValuesLevel1 = api.getValuesDiff(1);
      }}
      data-testid="form"
    >
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
  const { getByTestId } = render(
    <Form
      onSubmit={(_, api) => {
        isInputDisabled = api.isDisabled('profile.firstName');
      }}
      data-testid="form"
    >
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

test('change input -> unsure onChange is called ', () => {
  const onChange = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}} onChange={onChange}>
      <Text name="profile.firstName" data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  fireEvent.change(input, { target: { value: 'Bill' } });
  expect(onChange).toHaveBeenCalled();
});

test('touch input -> unsure onTouch is called ', () => {
  const onTouch = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}} onTouch={onTouch}>
      <Text name="profile.firstName" data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  input.focus();
  input.blur();
  expect(onTouch).toHaveBeenCalled();
});

test('set onError -> submit', () => {
  const onError = jest.fn();
  const validation = () => ({
    profile: {
      firstName: [Validator.Required()],
    },
  });
  const { getByTestId } = render(
    <Form onSubmit={() => {}} onError={onError} validation={validation} data-testid="form">
      <Text name="profile.firstName" />
    </Form>,
  );
  const form = getByTestId('form');
  fireEvent.submit(form);
  expect(onError).toHaveBeenCalledWith({ profile: { firstName: ['Required'] } }, expect.any(Object));
});

test('set errorClass -> submit', () => {
  const validation = () => ({
    profile: {
      firstName: [Validator.Required()],
    },
  });
  const errorClass = 'foo';
  const { getByTestId } = render(
    <Form onSubmit={() => {}} validation={validation} data-testid="form" errorClass={errorClass}>
      <Text name="profile.firstName" />
      <FieldError name="profile.firstName" data-testid="error" />
    </Form>,
  );
  const form = getByTestId('form');
  fireEvent.submit(form);
  expect(getByTestId('error')).toHaveClass(errorClass);
});

test('set invalidClass -> submit', () => {
  const validation = () => ({
    profile: {
      firstName: [Validator.Required()],
    },
  });
  const invalidClass = 'foo';
  const { getByTestId } = render(
    <Form onSubmit={() => {}} validation={validation} data-testid="form" invalidClass={invalidClass}>
      <Text name="profile.firstName" data-testid="input" />
    </Form>,
  );
  const form = getByTestId('form');
  const input = getByTestId('input');
  fireEvent.submit(form);
  expect(input).toHaveClass(invalidClass);
});
