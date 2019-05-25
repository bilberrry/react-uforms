import React, { Component } from 'react';
import { Form, Text } from 'react-uforms';
import CodeJsx from './CodeJsx';
import CodeJson from './CodeJson';

class ExampleValuesDiff extends Component {
  state = {
    values: null,
    code: `import { Form, Text } from 'react-uforms'

const example = (
  <Form
    defaultValues={{
        email: 'foo.bar@example.com',
        password: '12345',
    }}
    onSubmit={values => console.log(values)}
    diff={true}
  >
    <label htmlFor="email">Email</label>
    <Text type="text" id="email" name="email" />
    
    <label htmlFor="password">Password</label>
    <Text type="password" id="password" name="password" />
    
    <button type="submit">Submit</button>
  </Form>
);`,
  };

  render() {
    const { code, values } = this.state;
    return (
      <div id="updates-only">
        <h4>
          8. Form option to submit values difference{' '}
          <a href="#updates-only" className="anchor" aria-label="anchor" aria-hidden="true">
            #
          </a>
        </h4>
        <div className="row">
          <div className="col-6">
            <Form
              defaultValues={{
                email: 'foo.bar@example.com',
                password: '12345',
              }}
              onSubmit={formValues => {
                this.setState({
                  values: formValues,
                });
              }}
              diff
            >
              <label htmlFor="e1_email">Email</label>
              <Text type="text" id="e1_email" name="email" />

              <label htmlFor="e1_password">Password</label>
              <Text type="password" id="e1_password" name="password" />

              <button type="submit">Submit</button>
            </Form>
          </div>
          <div className="col-4">
            {values && (
              <div>
                <samp>
                  onSubmit <small>log</small>
                </samp>
                <CodeJson value={values} />
              </div>
            )}
          </div>
        </div>
        <CodeJsx value={code} />
      </div>
    );
  }
}

export default ExampleValuesDiff;
