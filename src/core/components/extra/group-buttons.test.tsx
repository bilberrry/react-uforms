/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../form';
import { Group } from './group';
import { GroupPrev, GroupNext, GroupJump } from './group-buttons';
import { Text } from '../fields/text';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  const { unmount } = render(
    <Form onSubmit={() => {}}>
      <Group name="group1">
        <Text name="profile.firstName" />
        <GroupNext>Next Step</GroupNext>
      </Group>
      <Group name="group2">
        <Text name="profile.middleName" />
        <GroupPrev />
        <GroupNext>Next Step</GroupNext>
      </Group>
      <Group name="group3">
        <Text name="profile.lastName" />
        <GroupJump to={'group'}>Go to first step</GroupJump>
        <GroupNext />
      </Group>
    </Form>,
  );
  unmount();
});

test('clickPrev', async () => {
  const submit = jest.fn();
  const { getByTestId } = render(
    <Form onSubmit={submit}>
      <Group name="group1" data-testid="group1" defaultActive={true}>
        <Text name="profile.firstName" />
        <GroupNext data-testid="g1-next">Next Step</GroupNext>
      </Group>
      <Group name="group2" data-testid="group2">
        <Text name="profile.middleName" />
        <GroupPrev data-testid="g2-prev" />
        <GroupNext data-testid="g2-next">Next Step</GroupNext>
      </Group>
      <Group name="group3" data-testid="group3">
        <Text name="profile.lastName" />
        <GroupJump to="group1" data-testid="g3-jump">
          Go to first step
        </GroupJump>
        <GroupNext data-testid="g3-next" />
      </Group>
    </Form>,
  );
  const group1 = getByTestId('group1');
  const group2 = getByTestId('group2');
  const group3 = getByTestId('group3');
  const g1Next = getByTestId('g1-next');
  const g2Prev = getByTestId('g2-prev');
  const g2Next = getByTestId('g2-next');
  const g3Jump = getByTestId('g3-jump');
  const g3Next = getByTestId('g3-next');
  await waitFor(() => expect(group1).not.toHaveStyle('display: none'));
  await waitFor(() => expect(group2).toHaveStyle('display: none'));
  await waitFor(() => expect(group3).toHaveStyle('display: none'));
  fireEvent.click(g1Next);
  await waitFor(() => expect(group1).toHaveStyle('display: none'));
  await waitFor(() => expect(group2).not.toHaveStyle('display: none'));
  await waitFor(() => expect(group3).toHaveStyle('display: none'));
  fireEvent.click(g2Prev);
  await waitFor(() => expect(group1).not.toHaveStyle('display: none'));
  await waitFor(() => expect(group2).toHaveStyle('display: none'));
  await waitFor(() => expect(group3).toHaveStyle('display: none'));
  fireEvent.click(g1Next);
  await waitFor(() => expect(group2).not.toHaveStyle('display: none'));
  fireEvent.click(g2Next);
  await waitFor(() => expect(group1).toHaveStyle('display: none'));
  await waitFor(() => expect(group2).toHaveStyle('display: none'));
  await waitFor(() => expect(group3).not.toHaveStyle('display: none'));
  fireEvent.click(g3Next);
  await waitFor(() => expect(submit).toHaveBeenCalledWith(expect.any(Object), expect.any(Object)));
  fireEvent.click(g3Jump);
  await waitFor(() => expect(group1).not.toHaveStyle('display: none'));
  await waitFor(() => expect(group2).toHaveStyle('display: none'));
  await waitFor(() => expect(group3).toHaveStyle('display: none'));
});
