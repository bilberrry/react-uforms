/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { FieldArray } from './field-array';
import { Text } from './text';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <FieldArray name="profile.posts">{() => <>Some component</>}</FieldArray>
    </Form>,
  );
  unmount();
});

test('default values -> change item -> submit', async () => {
  const submit = jest.fn();
  const defaultValues = {
    profile: {
      posts: [
        { id: 5, title: 'Foo' },
        { id: 7, title: 'Bar' },
      ],
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} defaultValues={defaultValues} data-testid="form">
      <FieldArray name="profile.posts">
        {(items) => (
          <>
            {items.map((item, index) => (
              <div key={`${item}`}>
                <Text name={`${item}.id`} data-testid={`${item}-${index}-id`} />
                <Text name={`${item}.title`} data-testid={`${item}-${index}-title`} />
              </div>
            ))}
          </>
        )}
      </FieldArray>
    </Form>,
  );
  const form = getByTestId('form');
  const title5 = getByTestId('profile.posts.0-0-title');
  const title7 = getByTestId('profile.posts.1-1-title');
  await waitFor(() => expect(title5).toHaveValue('Foo'));
  await waitFor(() => expect(title7).toHaveValue('Bar'));
  fireEvent.change(title7, { target: { value: 'Baz' } });
  await waitFor(() => expect(title5).toHaveValue('Foo'));
  await waitFor(() => expect(title7).toHaveValue('Baz'));
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      profile: {
        posts: [
          { id: 5, title: 'Foo' },
          { id: 7, title: 'Baz' },
        ],
      },
    }),
  );
});

test('default values -> add item -> submit', async () => {
  const submit = jest.fn();
  const defaultValues = {
    profile: {
      posts: [
        { id: 5, title: 'Foo' },
        { id: 7, title: 'Bar' },
      ],
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} defaultValues={defaultValues} data-testid="form">
      <FieldArray name="profile.posts">
        {(items, fieldArrayApi, formApi) => (
          <>
            {items.map((item, index) => (
              <div key={`${item}`}>
                <Text name={`${item}.id`} data-testid={`${item}-${index}-id`} />
                <Text name={`${item}.title`} data-testid={`${item}-${index}-title`} />
              </div>
            ))}
            <button type="button" onClick={() => fieldArrayApi.addItem()} data-testid="add-button">
              Add item
            </button>
            <span data-testid="items-length">{items.length}</span>
          </>
        )}
      </FieldArray>
    </Form>,
  );
  const form = getByTestId('form');
  const itemsLength = getByTestId('items-length');
  const addButton = getByTestId('add-button');
  expect(itemsLength.innerHTML).toBe('2');
  fireEvent.click(addButton);
  await waitFor(() => expect(itemsLength.innerHTML).toBe('3'));
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      profile: {
        posts: [
          { id: 5, title: 'Foo' },
          { id: 7, title: 'Bar' },
          { id: undefined, title: undefined },
        ],
      },
    }),
  );
  const newTitle = getByTestId('profile.posts.2-2-title');
  fireEvent.change(newTitle, { target: { value: 'Baz' } });
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      profile: {
        posts: [
          { id: 5, title: 'Foo' },
          { id: 7, title: 'Bar' },
          { id: undefined, title: 'Baz' },
        ],
      },
    }),
  );
});

test('default values -> remove item -> submit', async () => {
  const submit = jest.fn();
  const defaultValues = {
    profile: {
      posts: [
        { id: 5, title: 'Foo' },
        { id: 7, title: 'Bar' },
        { id: 9, title: 'Baz' },
      ],
    },
  };
  const { getByTestId } = render(
    <Form onSubmit={submit} defaultValues={defaultValues} data-testid="form">
      <FieldArray name="profile.posts">
        {(items, fieldArrayApi, formApi) => (
          <>
            {items.map((item, index) => (
              <div key={`${item}`}>
                <Text name={`${item}.id`} data-testid={`${item}-${index}-id`} />
                <Text name={`${item}.title`} data-testid={`${item}-${index}-title`} />
              </div>
            ))}
            <button type="button" onClick={() => fieldArrayApi.removeItem(1)} data-testid="remove-button">
              Remove item
            </button>
            <span data-testid="items-length">{items.length}</span>
          </>
        )}
      </FieldArray>
    </Form>,
  );
  const form = getByTestId('form');
  const itemsLength = getByTestId('items-length');
  const removeButton = getByTestId('remove-button');
  expect(itemsLength.innerHTML).toBe('3');
  fireEvent.click(removeButton);
  await waitFor(() => expect(itemsLength.innerHTML).toBe('2'));
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      profile: {
        posts: [
          { id: 5, title: 'Foo' },
          { id: 9, title: 'Baz' },
        ],
      },
    }),
  );
  const title9 = getByTestId('profile.posts.2-1-title');
  await waitFor(() => expect(title9).toHaveValue('Baz'));
  fireEvent.change(title9, { target: { value: 'Foobar' } });
  fireEvent.submit(form);
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(expect.any(Object), {
      profile: {
        posts: [
          { id: 5, title: 'Foo' },
          { id: 9, title: 'Foobar' },
        ],
      },
    }),
  );
});

// TODO move test case
