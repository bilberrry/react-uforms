import React from 'react';
import ReactDOM from 'react-dom';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Form } from '../src/index';

configure({ adapter: new Adapter() });

describe('Form', () => {
  it('renders without crashing', () => {
    const form = (
      <Form
        onSubmit={() => {}}
      >
        <div />
      </Form>
    );
    const div = document.createElement('div');
    ReactDOM.render(form, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('simulate submit', () => {
    const submit = jest.fn();
    const form = shallow(
      <Form
        onSubmit={submit}
      >
        <div />
      </Form>
    );
    form.find('form').simulate('submit');
    expect(submit).toHaveBeenCalled();
  });

  it('simulate submit and get values', () => {
    const submit = jest.fn();
    const values = {
      email: 'test@example.com',
      profile: {
        firstName: 'John',
        lastName: 'Brown'
      },
    };
    const form = shallow(
      <Form
        values={values}
        onSubmit={submit}
      >
        <div />
      </Form>
    );
    form.find('form').simulate('submit');
    expect(submit).toHaveBeenCalledWith(values);
  });
});

