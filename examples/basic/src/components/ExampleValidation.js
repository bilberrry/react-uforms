import React, { Component } from 'react';
import { Form, Validator, Text } from 'react-uforms';
import CodeJsx from './CodeJsx';
import CodeJson from './CodeJson';

class ExampleValidation extends Component {
  state = {
    values: null,
    errors: null,
    code: `import { Form, Text } from 'react-uforms'
    
const example = (
  <Form
    validation={() => ({
      email: [
        Validator.Required(),
        Validator.Email(),
      ],
      password: [
        Validator.Required(),
        Validator.MinLength(6),
        Validator.MaxLength(32),
        Validator.Preg(/^(?=.*[a-z]).+$/, 'At least 1 lowercase alphabetical character'),
        Validator.Preg(/^(?=.*[A-Z]).+$/, 'At least 1 uppercase alphabetical character'),
        Validator.Preg(/^(?=.*\\d+).+$/, 'At least 1 numeric character'),
      ]
    })}
    onSubmit={values => console.log(values)}
    onError={errors => console.log(errors)}
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
    const { code, values, errors } = this.state;

    return (
      <div id="validation">
        <h4>
          2. Validation{' '}
          <a href="#validation" className="anchor" aria-label="anchor" aria-hidden="true">
            #
          </a>
        </h4>
        <div className="row">
          <div className="col-6">
            <Form
              validation={() => ({
                email: [Validator.Required(), Validator.Email()],
                password: [
                  Validator.Required(),
                  Validator.MinLength(6),
                  Validator.MaxLength(32),
                  Validator.Preg(/^(?=.*[a-z]).+$/, 'At least 1 lowercase alphabetical character'),
                  Validator.Preg(/^(?=.*[A-Z]).+$/, 'At least 1 uppercase alphabetical character'),
                  Validator.Preg(/^(?=.*\d+).+$/, 'At least 1 numeric character'),
                ],
              })}
              onSubmit={formValues => {
                this.setState({
                  errors: null,
                  values: formValues,
                });
              }}
              onError={formErrors => {
                this.setState({
                  errors: formErrors,
                  values: null,
                });
              }}
            >
              <label htmlFor="e2_email">Email</label>
              <Text type="text" id="e2_email" name="email" />

              <label htmlFor="e2_password">Password</label>
              <Text type="password" id="e2_password" name="password" />

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
            {errors && (
              <div>
                <samp>
                  onError <small>log</small>
                </samp>
                <CodeJson value={errors} />
              </div>
            )}
          </div>
        </div>
        <CodeJsx value={code} />
      </div>
    );
  }
}

export default ExampleValidation;
