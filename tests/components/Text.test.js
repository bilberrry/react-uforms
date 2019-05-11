import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Form, Text } from '../../src';

configure({ adapter: new Adapter() });

describe('Fields -> Text', () => {
  const apiContext = {};
  const valuesContext = {};
  const errorsContext = {};

  jest.doMock('../../src/components/FormContext', () => ({
    ContextApi: {
      Consumer: props => props.children(apiContext),
    },
    ContextValues: {
      Consumer: props => props.children(valuesContext),
    },
    ContextErrors: {
      Consumer: props => props.children(errorsContext),
    },
  }));

  it('onSubmit without value', () => {
    const submit = jest.fn();
    const form = mount(
      <Form onSubmit={submit}>
        <Text name="profile.firstName" />
      </Form>,
    );
    form.find('input').simulate('change', {
      target: {
        value: 'John',
      },
    });
    form.find('form').simulate('submit');
    expect(submit).toHaveBeenCalledWith({
      profile: {
        firstName: 'John',
      },
    });
  });

  it('onSubmit with values', () => {
    const submit = jest.fn();
    const values = {
      email: 'test@example.com',
      profile: {
        firstName: 'John',
        lastName: 'Brown',
      },
    };
    const form = mount(
      <Form values={values} onSubmit={submit}>
        <Text name="profile.firstName" />
      </Form>,
    );
    form.find('input').simulate('change', {
      target: {
        value: 'Bill',
      },
    });
    form.find('form').simulate('submit');
    expect(submit).toHaveBeenCalledWith({
      email: 'test@example.com',
      profile: {
        firstName: 'Bill',
        lastName: 'Brown',
      },
    });
  });
});
