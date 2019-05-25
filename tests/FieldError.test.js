import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';
import { Form, FieldError, Text, Validator } from '../src';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <FieldError name="profile.firstName" />
    </Form>,
  );
  unmount();
});

test('submit form', () => {
  const validation = () => ({
    profile: {
      firstName: [Validator.Required()],
    },
  });
  const { getByTestId } = render(
    <Form onSubmit={() => {}} validation={validation} data-testid="form">
      <Text name="profile.firstName" />
      <FieldError name="profile.firstName" data-testid="error" />
    </Form>,
  );
  const form = getByTestId('form');
  fireEvent.submit(form);
  expect(getByTestId('error')).toBeInTheDocument();
});

test('touch input', () => {
  const validation = () => ({
    profile: {
      firstName: [Validator.Required()],
    },
  });
  const { getByTestId } = render(
    <Form onSubmit={() => {}} validation={validation}>
      <Text name="profile.firstName" data-testid="input" />
      <FieldError name="profile.firstName" data-testid="error" />
    </Form>,
  );
  const input = getByTestId('input');
  input.focus();
  input.blur();
  expect(getByTestId('error')).toBeInTheDocument();
});
