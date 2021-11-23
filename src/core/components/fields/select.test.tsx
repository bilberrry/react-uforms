/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { Select } from './select';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <Select
        name="address.country"
        options={[
          { value: null, name: 'Select country' },
          { value: 'US', name: 'United States' },
          { value: -1, name: 'Asgard' },
        ]}
      />
    </Form>,
  );
  unmount();
});

test('change input value -> submit form', async () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <Select
        name="address.country"
        data-testid="input"
        options={[
          { value: null, name: 'Select country', 'data-testid': 'opt-null' },
          { value: 'US', name: 'United States', 'data-testid': 'opt-us' },
          { value: -1, name: 'Asgard', 'data-testid': 'opt-as' },
        ]}
      />
    </Form>,
  );
  const optNull = getByTestId('opt-null');
  const optUs = getByTestId('opt-us');
  const optAs = getByTestId('opt-as');
  const input = getByTestId('input');
  const form = getByTestId('form');
  fireEvent.change(input, { target: { value: optUs.getAttribute('value') } });
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      address: {
        country: 'US',
      },
    }),
  );
  fireEvent.change(input, { target: { value: optNull.getAttribute('value') } });
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      address: {
        country: null,
      },
    }),
  );
  fireEvent.change(input, { target: { value: optAs.getAttribute('value') } });
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      address: {
        country: -1,
      },
    }),
  );
});

test('set default values -> change input value -> submit form', async () => {
  const submit = jest.fn();
  const defaultValues = {
    address: {
      country: -1,
      city: 'Valhalla',
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} defaultValues={defaultValues} data-testid="form">
      <Select
        name="address.country"
        data-testid="input"
        options={[
          { value: null, name: 'Select country', 'data-testid': 'opt-null' },
          { value: 'US', name: 'United States', 'data-testid': 'opt-us' },
          { value: -1, name: 'Neverland', 'data-testid': 'opt-as' },
        ]}
      />
    </Form>,
  );
  const optNull = getByTestId('opt-null');
  const optAs = getByTestId('opt-as');
  const input = getByTestId('input');
  const form = getByTestId('form');
  expect(optAs).toHaveProperty('selected');
  fireEvent.change(input, { target: { value: optNull.getAttribute('value') } });
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      address: {
        country: null,
        city: 'Valhalla',
      },
    }),
  );
  expect(optNull).toHaveProperty('selected');
});

test('set onChange attribute -> change input value ', async () => {
  const change = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <Select
        name="address.country"
        data-testid="input"
        onChange={change}
        options={[
          { value: null, name: 'Select country' },
          { value: 'US', name: 'United States' },
          { value: -1, name: 'Asgard', 'data-testid': 'opt-as' },
        ]}
      />
    </Form>,
  );

  const input = getByTestId('input');
  const optAs = getByTestId('opt-as');
  fireEvent.change(input, { target: { value: optAs.getAttribute('value') } });
  await waitFor(() => expect(change).toHaveBeenCalled());
});

test('set onBlur attribute -> focus input -> blur input', async () => {
  const blur = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <Select
        name="address.country"
        data-testid="input"
        onBlur={blur}
        options={[
          { value: null, name: 'Select country' },
          { value: 'US', name: 'United States' },
          { value: -1, name: 'Asgard' },
        ]}
      />
    </Form>,
  );
  const input = getByTestId('input');
  input.focus();
  expect(input).toHaveFocus();
  input.blur();
  expect(input).not.toHaveFocus();
  await waitFor(() => expect(blur).toHaveBeenCalled());
});
