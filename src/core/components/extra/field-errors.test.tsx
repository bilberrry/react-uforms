/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import * as yup from 'yup';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { Text } from '../fields/text';
import { FieldErrors } from './field-errors';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <FieldErrors name="profile.firstName" />
    </Form>,
  );
  unmount();
});

test('submit form', async () => {
  const validation = yup.object({
    id: yup.string().required(),
    profile: yup.object({
      firstName: yup.string().required(),
    }),
  });
  const { getByTestId } = render(
    <Form onSubmit={() => {}} validation={validation} data-testid="form">
      <Text name="profile.firstName" />
      <FieldErrors name="profile.firstName" data-testid="error" />
    </Form>,
  );
  const form = getByTestId('form');
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() => expect(getByTestId('error')).toBeInTheDocument());
});

test('touch input', async () => {
  const validation = yup.object({
    id: yup.string().required(),
    profile: yup.object({
      firstName: yup.string().required(),
    }),
  });
  const { getByTestId } = render(
    <Form onSubmit={() => {}} validation={validation}>
      <Text name="profile.firstName" data-testid="input" />
      <FieldErrors name="profile.firstName" data-testid="error" />
    </Form>,
  );
  const input = getByTestId('input');
  act(() => {
    input.focus();
    input.blur();
  });
  await waitFor(() => expect(getByTestId('error')).toBeInTheDocument());
});
