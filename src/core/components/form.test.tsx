/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from './form';
import { Text } from './fields/text';
import * as yup from 'yup';

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

test('submit form', async () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit} data-testid="form">
      <div />
    </Form>,
  );
  const form = getByTestId('form');
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() => expect(submit).toHaveBeenCalled());
});

test('set default values -> submit form', async () => {
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
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() => expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: defaultValues })));
});

test('submit form -> ensure field is disabled ', async () => {
  let isInputDisabled;
  const { getByTestId } = render(
    <Form
      onSubmit={({ api }) => {
        isInputDisabled = api.getField('profile.firstName')?.isDisabled();
      }}
      data-testid="form"
    >
      <Text name="profile.firstName" data-testid="input" disabled />
    </Form>,
  );
  const form = getByTestId('form');
  const input = getByTestId('input');
  expect(input).toHaveProperty('disabled');
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() => expect(isInputDisabled).toBe(true));
});

test('set default values -> change input -> submit form', async () => {
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
  const targetValues1 = {
    ...defaultValues,
    email: 'bar@example.com',
  };
  const targetValues2 = {
    ...targetValues1,
    profile: {
      firstName: 'Bill',
      lastName: 'Brown',
      bio: 'Travel Blogger',
    },
  };
  const submitValues: Array<any> = [];
  const { getByTestId } = render(
    <Form
      defaultValues={defaultValues}
      onSubmit={({ values }) => {
        submitValues.push(values);
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
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() => expect(submitValues[0]).toEqual(defaultValues));
  act(() => {
    fireEvent.change(email, { target: { value: 'bar@example.com' } });
    fireEvent.submit(form);
  });
  await waitFor(() => expect(submitValues[1]).toEqual(targetValues1));
  act(() => {
    fireEvent.change(firstName, { target: { value: 'Bill' } });
    fireEvent.submit(form);
  });
  await waitFor(() => expect(submitValues[2]).toEqual(targetValues2));
});

test('change input -> unsure onChange is called ', async () => {
  const onChange = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}} onChange={onChange}>
      <Text name="profile.firstName" data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  act(() => {
    fireEvent.change(input, { target: { value: 'Bill' } });
  });
  await waitFor(() =>
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        changedField: 'profile.firstName',
        fieldValue: 'Bill',
      }),
    ),
  );
});

test('touch input -> unsure onTouch is called ', async () => {
  const onTouch = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}} onTouch={onTouch}>
      <Text name="profile.firstName" data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  act(() => {
    input.focus();
    input.blur();
  });
  await waitFor(() =>
    expect(onTouch).toHaveBeenCalledWith(
      expect.objectContaining({
        touchedField: 'profile.firstName',
      }),
    ),
  );
});

test('set onError -> submit', async () => {
  const onError = jest.fn();
  const validation = yup.object({
    profile: yup.object({
      firstName: yup.string().required('Required'),
    }),
  });
  const { getByTestId } = render(
    <Form onSubmit={() => {}} onError={onError} validation={validation} data-testid="form">
      <Text name="profile.firstName" />
    </Form>,
  );
  const form = getByTestId('form');
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() =>
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: [
          {
            id: 'profile.firstName',
            errors: ['Required'],
          },
        ],
      }),
    ),
  );
});

test('change input -> unsure isChanged is true ', async () => {
  const defaultValues = {
    email: 'test@example.com',
    profile: {
      firstName: 'John',
      lastName: 'Brown',
    },
  };
  const { getByTestId } = render(
    <Form defaultValues={defaultValues} onSubmit={() => {}}>
      {({ isChanged }) => (
        <>
          <Text name="profile.firstName" data-testid="input" />
          <button type="submit" disabled={!isChanged()} data-testid="button" />
        </>
      )}
    </Form>,
  );
  const input = getByTestId('input');
  const button = getByTestId('button');
  await waitFor(() => expect(button).toHaveAttribute('disabled'));
  act(() => {
    fireEvent.change(input, { target: { value: 'Bill' } });
  });
  await waitFor(() => expect(button).not.toHaveAttribute('disabled'));
  act(() => {
    fireEvent.change(input, { target: { value: 'John' } });
  });
  await waitFor(() => expect(button).toHaveAttribute('disabled'));
});

test('set classes -> field:invalid -> submit', async () => {
  const validation = yup.object({
    profile: yup.object({
      firstName: yup.string().required(),
    }),
  });
  const invalidClass = 'foo';
  const { getByTestId } = render(
    <Form
      onSubmit={() => {}}
      validation={validation}
      data-testid="form"
      classes={{ field: { error: 'is-error', invalid: invalidClass } }}
    >
      <Text name="profile.firstName" data-testid="input" />
    </Form>,
  );
  const form = getByTestId('form');
  const input = getByTestId('input');
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() => expect(input).toHaveClass(invalidClass));
  act(() => {
    fireEvent.change(input, { target: { value: 'Bill' } });
    fireEvent.submit(form);
  });
  await waitFor(() => expect(input).not.toHaveClass(invalidClass));
});

test('set cast validation', async () => {
  const submit = jest.fn();
  const defaultValues = {
    id: 2,
    profile: {
      firstName: 'John',
      lastName: 'Brown',
      age: '30',
    },
  };
  const validation = yup.object({
    profile: yup.object({
      age: yup.number().required('Required'),
    }),
  });
  const { getByTestId } = render(
    <Form onSubmit={submit} validation={validation} defaultValues={defaultValues} data-testid="form">
      <Text name="profile.age" data-testid="input" />
    </Form>,
  );
  const form = getByTestId('form');
  const input = getByTestId('input');
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          id: 2,
          profile: {
            firstName: 'John',
            lastName: 'Brown',
            age: 30,
          },
        },
      }),
    ),
  );
  act(() => {
    fireEvent.change(input, { target: { value: '32' } });
    fireEvent.submit(form);
  });
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          id: 2,
          profile: {
            firstName: 'John',
            lastName: 'Brown',
            age: 32,
          },
        },
      }),
    ),
  );
});

test('set stripUnknown', async () => {
  const submit = jest.fn();
  const defaultValues = {
    id: 2,
    profile: {
      firstName: 'John',
      lastName: 'Brown',
      age: '30',
    },
  };
  const validation = yup.object({
    id: yup.number().required('Required'),
    profile: yup.object({
      firstName: yup.string().required('Required'),
      age: yup.number().required('Required'),
    }),
  });
  const { getByTestId } = render(
    <Form
      onSubmit={submit}
      validation={validation}
      defaultValues={defaultValues}
      stripUnknown={true}
      data-testid="form"
    >
      <Text name="profile.age" />
    </Form>,
  );
  const form = getByTestId('form');
  act(() => {
    fireEvent.submit(form);
  });
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          id: 2,
          profile: {
            firstName: 'John',
            age: 30,
          },
        },
      }),
    ),
  );
});
