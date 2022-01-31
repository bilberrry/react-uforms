/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { Group } from './group';
import { Text } from '../fields/text';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <Text name="profile.id" />
      <Group name="group1">
        <Text name="profile.firstName" />
      </Group>
      <Group name="group2">
        <Text name="profile.middleName" />
      </Group>
    </Form>,
  );
  unmount();
});

test('set defaultActive', async () => {
  const { getByTestId } = render(
    <Form onSubmit={() => {}}>
      <Text name="profile.id" />
      <Group name="group1" data-testid="group1">
        <Text name="profile.firstName" />
      </Group>
      <Group name="group2" defaultActive={true} data-testid="group2">
        <Text name="profile.middleName" />
      </Group>
      <Group name="group3" data-testid="group3">
        <Text name="profile.lastName" />
      </Group>
    </Form>,
  );
  const group1 = getByTestId('group1');
  const group2 = getByTestId('group2');
  const group3 = getByTestId('group3');
  await waitFor(() => expect(group1).toHaveStyle('display: none'));
  await waitFor(() => expect(group2).not.toHaveStyle('display: none'));
  await waitFor(() => expect(group3).toHaveStyle('display: none'));
});
