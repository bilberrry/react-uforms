/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { Radio } from './radio';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <Radio name="profile.gender" value="male" />
      <Radio name="profile.gender" value="female" />
    </Form>,
  );
  unmount();
});

test('check input -> submit form', async () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <Radio name="profile.gender" value="male" data-testid="input-male" />
      <Radio name="profile.gender" value="female" data-testid="input-female" />
    </Form>,
  );
  const inputMale = getByTestId('input-male');
  const inputFemale = getByTestId('input-female');
  const form = getByTestId('form');
  fireEvent.click(inputMale);
  expect(inputMale).toHaveProperty('checked');
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      profile: {
        gender: 'male',
      },
    }),
  );
  fireEvent.click(inputFemale);
  expect(inputFemale).toHaveProperty('checked');
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      profile: {
        gender: 'female',
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
      gender: 'male',
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} defaultValues={defaultValues} data-testid="form">
      <Radio name="profile.gender" value="male" data-testid="input-male" />
      <Radio name="profile.gender" value="female" data-testid="input-female" />
    </Form>,
  );
  const inputMale = getByTestId('input-male');
  const inputFemale = getByTestId('input-female');
  const form = getByTestId('form');
  expect(inputMale).toHaveProperty('checked');
  fireEvent.submit(form);
  await waitFor(() => expect(submit).toHaveBeenCalledWith(expect.any(Object), defaultValues));
  fireEvent.click(inputFemale);
  expect(inputFemale).toHaveProperty('checked');
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      email: 'test@example.com',
      profile: {
        firstName: 'Kelly',
        lastName: 'Brown',
        gender: 'female',
      },
    }),
  );
});

test('set onChange attribute -> change input value ', () => {
  const changeMale = jest.fn();
  const changeFemale = jest.fn();
  const changeNone = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <Radio name="profile.gender" value="male" onChange={changeMale} data-testid="input-male" />
      <Radio name="profile.gender" value="female" onChange={changeFemale} data-testid="input-female" />
      <Radio name="profile.gender" value={null} onChange={changeNone} data-testid="input-none" />
    </Form>,
  );
  const inputMale = getByTestId('input-male');
  const inputFemale = getByTestId('input-female');
  const inputNone = getByTestId('input-none');
  fireEvent.click(inputMale);
  expect(changeMale).toHaveBeenCalledTimes(1);
  expect(changeFemale).not.toHaveBeenCalled();
  expect(changeNone).not.toHaveBeenCalled();
  fireEvent.click(inputFemale);
  expect(changeMale).toHaveBeenCalledTimes(1);
  expect(changeFemale).toHaveBeenCalledTimes(1);
  expect(changeNone).not.toHaveBeenCalled();
  fireEvent.click(inputNone);
  expect(changeMale).toHaveBeenCalledTimes(1);
  expect(changeFemale).toHaveBeenCalledTimes(1);
  expect(changeNone).toHaveBeenCalledTimes(1);
});

test('set onBlur attribute -> focus input -> blur input', () => {
  const blurMale = jest.fn();
  const blurFemale = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <Radio name="profile.gender" value="male" onBlur={blurMale} data-testid="input-male" />
      <Radio name="profile.gender" value="female" onBlur={blurFemale} data-testid="input-female" />
    </Form>,
  );
  const inputMale = getByTestId('input-male');
  const inputFemale = getByTestId('input-female');
  inputMale.focus();
  expect(inputMale).toHaveFocus();
  inputMale.blur();
  expect(inputMale).not.toHaveFocus();
  expect(blurMale).toHaveBeenCalled();
  expect(blurFemale).not.toHaveBeenCalled();
  inputFemale.focus();
  expect(inputFemale).toHaveFocus();
  inputFemale.blur();
  expect(blurFemale).toHaveBeenCalled();
});
