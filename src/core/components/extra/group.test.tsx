/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
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
      <Group name="group2" defaultActive={true}>
        <Text name="profile.middleName" />
      </Group>
      <Group name="group3">
        <Text name="profile.lastName" />
      </Group>
    </Form>,
  );
  unmount();
});
