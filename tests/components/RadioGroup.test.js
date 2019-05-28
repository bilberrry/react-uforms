import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';
import { Form, RadioGroup, RadioGroupItem } from '../../src';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <RadioGroup name="profile.gender">
        <RadioGroupItem value="male" />
        <RadioGroupItem value="female" />
      </RadioGroup>
    </Form>,
  );
  unmount();
});

test('check input -> submit form', () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <RadioGroup name="profile.gender">
        <RadioGroupItem value="male" data-testid="input-male" />
        <RadioGroupItem value="female" data-testid="input-female" />
      </RadioGroup>
    </Form>,
  );
  const inputMale = getByTestId('input-male');
  const inputFemale = getByTestId('input-female');
  const form = getByTestId('form');
  fireEvent.click(inputMale);
  expect(inputMale).toHaveProperty('checked');
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledWith(
    {
      profile: {
        gender: 'male',
      },
    },
    expect.any(Object),
  );
  fireEvent.click(inputFemale);
  expect(inputFemale).toHaveProperty('checked');
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledWith(
    {
      profile: {
        gender: 'female',
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
      gender: 'male',
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} defaultValues={defaultValues} data-testid="form">
      <RadioGroup name="profile.gender">
        <RadioGroupItem value="male" data-testid="input-male" />
        <RadioGroupItem value="female" data-testid="input-female" />
      </RadioGroup>
    </Form>,
  );
  const inputMale = getByTestId('input-male');
  const inputFemale = getByTestId('input-female');
  const form = getByTestId('form');
  expect(inputMale).toHaveProperty('checked');
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledWith(defaultValues, expect.any(Object));
  fireEvent.click(inputFemale);
  expect(inputFemale).toHaveProperty('checked');
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledWith(
    {
      email: 'test@example.com',
      profile: {
        firstName: 'Kelly',
        lastName: 'Brown',
        gender: 'female',
      },
    },
    expect.any(Object),
  );
});

test('set onChange attribute -> change input value ', async () => {
  const change = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <RadioGroup name="profile.gender" onChange={change}>
        <RadioGroupItem value="male" data-testid="input-male" />
        <RadioGroupItem value="female" data-testid="input-female" />
      </RadioGroup>
    </Form>,
  );
  const inputMale = getByTestId('input-male');
  const inputFemale = getByTestId('input-female');
  fireEvent.click(inputMale);
  expect(change).toHaveBeenCalledTimes(1);
  fireEvent.click(inputFemale);
  expect(change).toHaveBeenCalledTimes(2);
});

test('set onBlur attribute -> focus input -> blur input', () => {
  const blurMale = jest.fn();
  const blurFemale = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <RadioGroup name="profile.gender">
        <RadioGroupItem value="male" onBlur={blurMale} data-testid="input-male" />
        <RadioGroupItem value="female" onBlur={blurFemale} data-testid="input-female" />
      </RadioGroup>
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
