import React, { Component } from 'react';
import { Form, Validator, Text } from 'react-uforms';
import Code from './Code';
import Json from './Json';

class ExampleCustomValidation extends Component {
  state = {
    values: null,
    errors: null,
    code: `import { Form, Text } from 'react-uforms'
    
const example = (
  <Form
    validation={({ getValue }) => ({
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
      ],
      password2: [
        Validator.Required(),
        (value) => {
          if (getValue('password') !== value) {
            return 'Retype password is not equal.'
          }
          return true;
        },
      ]
    })}
    onSubmit={values => console.log(values)}
    onError={errors => console.log(errors)}
  >
    <label htmlFor="email">Email</label>
    <Text type="text" id="email" name="email" />
  
    <label htmlFor="password">Password</label>
    <Text type="password" id="password" name="password" />
    
    <label htmlFor="password2">Retype Password</label>
    <Text type="password" id="password2" name="password2" />
  
    <button type="submit">Submit</button>
  </Form>
);`,
  };

  render() {
    const { code, values, errors } = this.state;

    return (
      <div id="custom-validation">
        <h4>
          3. Custom validation{' '}
          <a href="#custom-validation" className="anchor" aria-label="anchor" aria-hidden="true">
            #
          </a>
        </h4>
        <div className="row">
          <div className="col-6">
            <Form
              validation={({ getValue }) => ({
                email: [Validator.Required(), Validator.Email()],
                password: [
                  Validator.Required(),
                  Validator.MinLength(6),
                  Validator.MaxLength(32),
                  Validator.Preg(/^(?=.*[a-z]).+$/, 'At least 1 lowercase alphabetical character'),
                  Validator.Preg(/^(?=.*[A-Z]).+$/, 'At least 1 uppercase alphabetical character'),
                  Validator.Preg(/^(?=.*\d+).+$/, 'At least 1 numeric character'),
                ],
                password2: [
                  Validator.Required(),
                  value => {
                    if (getValue('password') !== value) {
                      return 'Retype password is not equal.';
                    }
                    return true;
                  },
                ],
              })}
              onSubmit={values => {
                this.setState({
                  errors: null,
                  values,
                });
              }}
              onError={errors => {
                this.setState({
                  errors,
                  values: null,
                });
              }}
            >
              <label htmlFor="e3_email">Email</label>
              <Text type="text" id="e3_email" name="email" />

              <label htmlFor="e3_password">Password</label>
              <Text type="password" id="e3_password" name="password" />

              <label htmlFor="e3_password2">Retype Password</label>
              <Text type="password" id="e3_password2" name="password2" />

              <button type="submit">Submit</button>
            </Form>
          </div>
          <div className="col-4">
            {values && (
              <div>
                <samp>
                  onSubmit <small>log</small>
                </samp>
                <Json value={values} />
              </div>
            )}
            {errors && (
              <div>
                <samp>
                  onError <small>log</small>
                </samp>
                <Json value={errors} />
              </div>
            )}
          </div>
        </div>
        <Code value={code} />
      </div>
    );
  }
}

export default ExampleCustomValidation;
