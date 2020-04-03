/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Form, CheckboxGroup, CheckboxGroupItem } from '../../index';

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

test('check input -> submit form', () => {
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
  expect(submit).toHaveBeenCalledWith(
    {
      profile: {
        subscription: ['news'],
      },
    },
    expect.any(Object),
  );
  fireEvent.click(inputUpdates);
  expect(inputUpdates).toHaveProperty('checked');
  fireEvent.click(inputCompany);
  expect(inputCompany).toHaveProperty('checked');
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledWith(
    {
      profile: {
        subscription: ['news', 'updates', 'company'],
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
  expect(inputUpdates).toHaveProperty('checked');
  fireEvent.click(inputUpdates);
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledWith(
    {
      email: 'test@example.com',
      profile: {
        firstName: 'Kelly',
        lastName: 'Brown',
        subscription: [],
      },
    },
    expect.any(Object),
  );
  fireEvent.click(inputCompany);
  expect(inputCompany).toHaveProperty('checked');
  fireEvent.click(inputNews);
  expect(inputNews).toHaveProperty('checked');
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledWith(
    {
      email: 'test@example.com',
      profile: {
        firstName: 'Kelly',
        lastName: 'Brown',
        subscription: ['company', 'news'],
      },
    },
    expect.any(Object),
  );
});

test('set onChange attribute -> change input value ', async () => {
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

test('without form', () => {
  const log = jest.spyOn(global.console, 'error');
  render(
    <CheckboxGroup name="profile.subscription">
      <CheckboxGroupItem value="news" data-testid="input-news" />
      <CheckboxGroupItem value="updates" data-testid="input-updates" />
      <CheckboxGroupItem value="company" data-testid="input-company" />
    </CheckboxGroup>,
  );
  expect(log).toHaveBeenCalledWith('Could not found Form API. Make sure <CheckboxGroup/> is in the <Form/>.');
});
