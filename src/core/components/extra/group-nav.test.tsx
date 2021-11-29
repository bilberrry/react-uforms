/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { Group } from './group';
import { GroupNav } from './group-nav';
import { Text } from '../fields/text';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <GroupNav />
      <Group name="group1">
        <Text name="profile.firstName" />
      </Group>
    </Form>,
  );
  unmount();
});

test('render group nav', () => {
  const { getByText } = render(
    <Form onSubmit={() => {}}>
      <Text name="profile.id" />
      <GroupNav />
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
  const step1 = getByText('group1');
  const step2 = getByText('group2');
  const step3 = getByText('group3');
  expect(step1).toBeInTheDocument();
  expect(step2).toBeInTheDocument();
  expect(step3).toBeInTheDocument();
});

test('set childNode', () => {
  const { getByText } = render(
    <Form onSubmit={() => {}}>
      <Text name="profile.id" />
      <GroupNav childNode={(group) => <span>{group.getObject().name}-bar</span>} />
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
  const step1 = getByText('group1-bar');
  const step2 = getByText('group2-bar');
  const step3 = getByText('group3-bar');
  expect(step1).toBeInTheDocument();
  expect(step2).toBeInTheDocument();
  expect(step3).toBeInTheDocument();
});

test('clickNext', async () => {
  const { getByText, getByTestId } = render(
    <Form onSubmit={() => {}}>
      <GroupNav clickNext={false} clickPrev={true} />
      <Group name="group1" data-testid="g1">
        <Text name="profile.firstName" />
      </Group>
      <Group name="group2" defaultActive={true} data-testid="g2">
        <Text name="profile.middleName" />
      </Group>
      <Group name="group3" data-testid="g3">
        <Text name="profile.lastName" />
      </Group>
    </Form>,
  );
  const step1 = getByText('group1');
  const step3 = getByText('group3');
  const group1 = getByTestId('g1');
  const group2 = getByTestId('g2');
  const group3 = getByTestId('g3');
  await waitFor(() => expect(group1).toHaveStyle('display: none'));
  await waitFor(() => expect(group2).not.toHaveStyle('display: none'));
  await waitFor(() => expect(group3).toHaveStyle('display: none'));
  fireEvent.click(step3);
  await waitFor(() => expect(group1).toHaveStyle('display: none'));
  await waitFor(() => expect(group2).not.toHaveStyle('display: none'));
  await waitFor(() => expect(group3).toHaveStyle('display: none'));
  fireEvent.click(step1);
  await waitFor(() => expect(group1).not.toHaveStyle('display: none'));
  await waitFor(() => expect(group2).toHaveStyle('display: none'));
  await waitFor(() => expect(group3).toHaveStyle('display: none'));
});

test('clickPrev', async () => {
  const { getByText, getByTestId } = render(
    <Form onSubmit={() => {}}>
      <GroupNav clickNext={true} clickPrev={false} />
      <Group name="group1" data-testid="g1">
        <Text name="profile.firstName" />
      </Group>
      <Group name="group2" defaultActive={true} data-testid="g2">
        <Text name="profile.middleName" />
      </Group>
      <Group name="group3" data-testid="g3">
        <Text name="profile.lastName" />
      </Group>
    </Form>,
  );
  const step1 = getByText('group1');
  const step3 = getByText('group3');
  const group1 = getByTestId('g1');
  const group2 = getByTestId('g2');
  const group3 = getByTestId('g3');
  await waitFor(() => expect(group1).toHaveStyle('display: none'));
  await waitFor(() => expect(group2).not.toHaveStyle('display: none'));
  await waitFor(() => expect(group3).toHaveStyle('display: none'));
  fireEvent.click(step1);
  await waitFor(() => expect(group1).toHaveStyle('display: none'));
  await waitFor(() => expect(group2).not.toHaveStyle('display: none'));
  await waitFor(() => expect(group3).toHaveStyle('display: none'));
  fireEvent.click(step3);
  await waitFor(() => expect(group1).toHaveStyle('display: none'));
  await waitFor(() => expect(group2).toHaveStyle('display: none'));
  await waitFor(() => expect(group3).not.toHaveStyle('display: none'));
});
