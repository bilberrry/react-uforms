/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { CheckboxGroupItem } from './checkbox-group-item';
import { CheckboxGroup } from './checkbox-group';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <CheckboxGroup name="profile.subscription">
        <CheckboxGroupItem value="news" />
        <CheckboxGroupItem value="updates" />
        <CheckboxGroupItem value="company" />
      </CheckboxGroup>
    </Form>,
  );
  unmount();
});

test('check input -> submit form', async () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <CheckboxGroup name="profile.subscription">
        <CheckboxGroupItem value="news" data-testid="input-news" />
        <CheckboxGroupItem value="updates" data-testid="input-updates" />
        <CheckboxGroupItem value="company" data-testid="input-company" />
      </CheckboxGroup>
    </Form>,
  );
  const inputNews = getByTestId('input-news');
  const inputUpdates = getByTestId('input-updates');
  const inputCompany = getByTestId('input-company');
  const form = getByTestId('form');
  fireEvent.click(inputNews);
  expect(inputNews).toHaveProperty('checked');
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      profile: {
        subscription: ['news'],
      },
    }),
  );
  fireEvent.click(inputUpdates);
  expect(inputUpdates).toHaveProperty('checked');
  fireEvent.click(inputCompany);
  expect(inputCompany).toHaveProperty('checked');
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      profile: {
        subscription: ['news', 'updates', 'company'],
      },
    }),
  );
});

test('set default values -> uncheck input -> submit form', async () => {
  const submit = jest.fn();
  const defaultValues = {
    email: 'test@example.com',
    profile: {
      firstName: 'Kelly',
      lastName: 'Brown',
      subscription: ['updates'],
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} defaultValues={defaultValues} data-testid="form">
      <CheckboxGroup name="profile.subscription">
        <CheckboxGroupItem value="news" data-testid="input-news" />
        <CheckboxGroupItem value="updates" data-testid="input-updates" />
        <CheckboxGroupItem value="company" data-testid="input-company" />
      </CheckboxGroup>
    </Form>,
  );
  const inputNews = getByTestId('input-news');
  const inputUpdates = getByTestId('input-updates');
  const inputCompany = getByTestId('input-company');
  const form = getByTestId('form');
  await waitFor(() => expect(inputUpdates).toHaveProperty('checked', true));
  fireEvent.click(inputUpdates);
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      email: 'test@example.com',
      profile: {
        firstName: 'Kelly',
        lastName: 'Brown',
        subscription: [],
      },
    }),
  );
  fireEvent.click(inputCompany);
  expect(inputCompany).toHaveProperty('checked');
  fireEvent.click(inputNews);
  expect(inputNews).toHaveProperty('checked');
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      email: 'test@example.com',
      profile: {
        firstName: 'Kelly',
        lastName: 'Brown',
        subscription: ['company', 'news'],
      },
    }),
  );
});

test('set onChange attribute -> change input value ', () => {
  const change = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <CheckboxGroup name="profile.subscription" onChange={change}>
        <CheckboxGroupItem value="news" data-testid="input-news" />
        <CheckboxGroupItem value="updates" data-testid="input-updates" />
        <CheckboxGroupItem value="company" data-testid="input-company" />
      </CheckboxGroup>
    </Form>,
  );
  const inputNews = getByTestId('input-news');
  fireEvent.click(inputNews);
  expect(change).toHaveBeenCalledTimes(1);
  fireEvent.click(inputNews);
  expect(change).toHaveBeenCalledTimes(2);
});

test('set onBlur attribute -> focus input -> blur input', () => {
  const blurNews = jest.fn();
  const blurUpdates = jest.fn();
  const blurCompany = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <CheckboxGroup name="profile.subscription">
        <CheckboxGroupItem value="news" onBlur={blurNews} data-testid="input-news" />
        <CheckboxGroupItem value="updates" onBlur={blurUpdates} data-testid="input-updates" />
        <CheckboxGroupItem value="company" onBlur={blurCompany} data-testid="input-company" />
      </CheckboxGroup>
    </Form>,
  );
  const inputNews = getByTestId('input-news');
  const inputUpdates = getByTestId('input-updates');
  const inputCompany = getByTestId('input-company');
  inputNews.focus();
  expect(inputNews).toHaveFocus();
  inputNews.blur();
  expect(inputNews).not.toHaveFocus();
  fireEvent.click(inputNews);
  expect(blurNews).toHaveBeenCalled();
  expect(blurUpdates).not.toHaveBeenCalled();
  inputUpdates.focus();
  expect(inputUpdates).toHaveFocus();
  inputUpdates.blur();
  expect(inputUpdates).not.toHaveFocus();
  expect(blurUpdates).toHaveBeenCalled();
  expect(blurCompany).not.toHaveBeenCalled();
  inputCompany.focus();
  expect(inputCompany).toHaveFocus();
  inputCompany.blur();
  expect(inputCompany).not.toHaveFocus();
  expect(blurCompany).toHaveBeenCalled();
});
