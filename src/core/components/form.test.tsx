/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from './form';
import { Text } from './fields/text';
import * as Validator from '../validator';

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
  fireEvent.submit(form);
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
  fireEvent.submit(form);
  await waitFor(() => expect(submit).toHaveBeenCalledWith(expect.any(Object), defaultValues));
});

test('submit form -> ensure field is disabled ', async () => {
  let isInputDisabled;
  const { getByTestId } = render(
    <Form
      onSubmit={(api) => {
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
  fireEvent.submit(form);
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
      onSubmit={(api, values) => {
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
  fireEvent.submit(form);
  await waitFor(() => expect(submitValues[0]).toEqual(defaultValues));
  fireEvent.change(email, { target: { value: 'bar@example.com' } });
  fireEvent.submit(form);
  await waitFor(() => expect(submitValues[1]).toEqual(targetValues1));
  fireEvent.change(firstName, { target: { value: 'Bill' } });
  fireEvent.submit(form);
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
  fireEvent.change(input, { target: { value: 'Bill' } });
  await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.any(Object), 'profile.firstName', 'Bill'));
});

test('touch input -> unsure onTouch is called ', async () => {
  const onTouch = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={() => {}} onTouch={onTouch}>
      <Text name="profile.firstName" data-testid="input" />
    </Form>,
  );
  const input = getByTestId('input');
  input.focus();
  input.blur();
  await waitFor(() => expect(onTouch).toHaveBeenCalledWith(expect.any(Object), 'profile.firstName'));
});

test('set onError -> submit', async () => {
  const onError = jest.fn();
  const validators = () => ({
    profile: {
      firstName: [Validator.Required()],
    },
  });
  const { getByTestId } = render(
    <Form onSubmit={() => {}} onError={onError} validation={validators} data-testid="form">
      <Text name="profile.firstName" />
    </Form>,
  );
  const form = getByTestId('form');
  fireEvent.submit(form);
  await waitFor(() =>
    expect(onError).toHaveBeenCalledWith(expect.any(Object), [
      {
        id: 'profile.firstName',
        errors: ['Required'],
      },
    ]),
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
  fireEvent.change(input, { target: { value: 'Bill' } });
  await waitFor(() => expect(button).not.toHaveAttribute('disabled'));
  fireEvent.change(input, { target: { value: 'John' } });
  await waitFor(() => expect(button).toHaveAttribute('disabled'));
});

test('set classes -> field:invalid -> submit', async () => {
  const validation = () => ({
    profile: {
      firstName: [Validator.Required()],
    },
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
  fireEvent.submit(form);
  await waitFor(() => expect(input).toHaveClass(invalidClass));
  fireEvent.change(input, { target: { value: 'Bill' } });
  fireEvent.submit(form);
  await waitFor(() => expect(input).not.toHaveClass(invalidClass));
});

// test('set classes -> field:error -> submit', () => {
//   const validation = () => ({
//     profile: {
//       firstName: [Validator.Required()],
//     },
//   });
//   const errorClass = 'foo';
//   const { getByTestId } = render(
//     <Form
//       onSubmit={() => {}}
//       validation={validation}
//       data-testid="form"
//       classes={{ field: { error: errorClass, invalid: 'is-invalid' } }}
//     >
//       <Text name="profile.firstName" />
//       <FieldError name="profile.firstName" data-testid="error" />
//     </Form>,
//   );
//   const form = getByTestId('form');
//   fireEvent.submit(form);
//   expect(getByTestId('error')).toHaveClass(errorClass);
// })

//
//
// test('div form: renders without crashing', () => {
//   const { unmount } = render(
//     <Form onSubmit={() => {}} element="div">
//       <div />
//     </Form>,
//   );
//   unmount();
// });
//
// test('div form: set default values -> change input -> submit form -> get values difference', () => {
//   const defaultValues = {
//     id: 2,
//     email: 'foo@example.com',
//     profile: {
//       firstName: 'John',
//       lastName: 'Brown',
//       bio: 'Travel Blogger',
//     },
//     createdAt: '2018-04-25T20:36:02+00:00',
//   };
//   let diffValues = null;
//   let diffValuesLevel1 = null;
//   const { getByTestId } = render(
//     <Form
//       defaultValues={defaultValues}
//       onSubmit={(_, api) => {
//         diffValues = api.getValuesDiff();
//         diffValuesLevel1 = api.getValuesDiff(1);
//       }}
//       data-testid="form"
//     >
//       {api => (
//         <Fragment>
//           <Text name="id" disabled />
//           <Text name="email" data-testid="email" />
//           <Text name="profile.firstName" data-testid="first-name" />
//           <Text name="profile.lastName" />
//           <button type="button" onClick={() => api.submit()} data-testid="button" />
//         </Fragment>
//       )}
//     </Form>,
//   );
//   const submit = getByTestId('button');
//   const email = getByTestId('email');
//   const firstName = getByTestId('first-name');
//   fireEvent.click(submit);
//   expect(diffValues).toEqual({});
//   fireEvent.change(email, { target: { value: 'bar@example.com' } });
//   fireEvent.click(submit);
//   expect(diffValues).toEqual({ email: 'bar@example.com' });
//   fireEvent.change(firstName, { target: { value: 'Bill' } });
//   fireEvent.click(submit);
//   expect(diffValues).toEqual({
//     email: 'bar@example.com',
//     profile: {
//       firstName: 'Bill',
//     },
//   });
//   expect(diffValuesLevel1).toEqual({
//     email: 'bar@example.com',
//     profile: {
//       firstName: 'Bill',
//       lastName: 'Brown',
//       bio: 'Travel Blogger',
//     },
//   });
// });
