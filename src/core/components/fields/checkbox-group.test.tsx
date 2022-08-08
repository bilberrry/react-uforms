/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
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
  act(() => {
    fireEvent.click(inputNews);
  });
  expect(inputNews).toHaveProperty('checked');
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          profile: {
            subscription: ['news'],
          },
        },
      }),
    ),
  );
  act(() => {
    fireEvent.click(inputUpdates);
  });
  expect(inputUpdates).toHaveProperty('checked');
  act(() => {
    fireEvent.click(inputCompany);
  });
  expect(inputCompany).toHaveProperty('checked');
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          profile: {
            subscription: ['news', 'updates', 'company'],
          },
        },
      }),
    ),
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
  act(() => {
    fireEvent.click(inputUpdates);
    fireEvent.submit(form);
  });
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          email: 'test@example.com',
          profile: {
            firstName: 'Kelly',
            lastName: 'Brown',
            subscription: [],
          },
        },
      }),
    ),
  );
  act(() => {
    fireEvent.click(inputCompany);
  });
  expect(inputCompany).toHaveProperty('checked');
  act(() => {
    fireEvent.click(inputNews);
  });
  expect(inputNews).toHaveProperty('checked');
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          email: 'test@example.com',
          profile: {
            firstName: 'Kelly',
            lastName: 'Brown',
            subscription: ['company', 'news'],
          },
        },
      }),
    ),
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
  act(() => {
    fireEvent.click(inputNews);
  });
  await waitFor(() => expect(change).toHaveBeenCalledTimes(1));
  act(() => {
    fireEvent.click(inputNews);
  });
  await waitFor(() => expect(change).toHaveBeenCalledTimes(2));
});

test('set onBlur attribute -> focus input -> blur input', async () => {
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
  act(() => {
    inputNews.focus();
  });
  expect(inputNews).toHaveFocus();
  act(() => {
    inputNews.blur();
  });
  expect(inputNews).not.toHaveFocus();
  act(() => {
    fireEvent.click(inputNews);
  });
  await waitFor(() => expect(blurNews).toHaveBeenCalled());
  await waitFor(() => expect(blurUpdates).not.toHaveBeenCalled());
  act(() => {
    inputUpdates.focus();
  });
  expect(inputUpdates).toHaveFocus();
  act(() => {
    inputUpdates.blur();
  });
  expect(inputUpdates).not.toHaveFocus();
  await waitFor(() => expect(blurUpdates).toHaveBeenCalled());
  await waitFor(() => expect(blurCompany).not.toHaveBeenCalled());
  act(() => {
    inputCompany.focus();
  });
  expect(inputCompany).toHaveFocus();
  act(() => {
    inputCompany.blur();
  });
  expect(inputCompany).not.toHaveFocus();
  await waitFor(() => expect(blurCompany).toHaveBeenCalled());
});
