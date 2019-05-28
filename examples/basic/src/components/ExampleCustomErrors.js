import React, { Component } from 'react';
import { Form, Validator, Text, FieldError } from 'react-uforms';
import CodeJsx from './CodeJsx';
import CodeJson from './CodeJson';

class ExampleCustomErrors extends Component {
  state = {
    values: null,
    errors: null,
    code: `import { Form, Text, FieldError } from 'react-uforms';
    
const example = (
  <Form
    validation={() => ({
      email: [
        Validator.Required(),
        Validator.Email(),
      ],
      profile: {
        firstName: [
          Validator.Required(),
          Validator.MinLength(2),
          Validator.MaxLength(20),
        ],
        lastName: [
          Validator.Required(),
          Validator.MinLength(2),
          Validator.MaxLength(20),
        ],
      },
    })}
    errorClass="your-error-class"
    invalidClass="your-invalid-input-class"
    onSubmit={values => console.log(values)}
    onError={errors => console.log(errors)}
  >
    <label htmlFor="email">Email</label>
    <Text type="text" id="email" name="email" hideError={true} />
    <strong><FieldError name="email" /></strong>

    <label htmlFor="firstName">First Name</label>
    <Text type="text" id="firstName" name="profile.firstName" hideError={true} />
    <FieldError name="profile.firstName" className="add-some-error-class" />

    <label htmlFor="lastName">Last Name</label>
    <Text type="text" id="lastName" name="profile.lastName" />

    <button type="submit">Submit</button>
  </Form>
);`,
  };

  render() {
    const { code, values, errors } = this.state;

    return (
      <div id="errors-customization">
        <h4>
          6. Errors customization{' '}
          <a href="#errors-customization" className="anchor" aria-label="anchor" aria-hidden="true">
            #
          </a>
        </h4>
        <div className="row">
          <div className="col-6">
            <Form
              validation={() => ({
                email: [Validator.Required(), Validator.Email()],
                profile: {
                  firstName: [Validator.Required(), Validator.MinLength(2), Validator.MaxLength(20)],
                  lastName: [Validator.Required(), Validator.MinLength(2), Validator.MaxLength(20)],
                },
              })}
              errorClass="your-error-class"
              invalidClass="your-invalid-input-class"
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
              <label htmlFor="e6_email">Email</label>
              <Text type="text" id="e6_email" name="email" hideError />
              <strong>
                <FieldError name="email" />
              </strong>

              <label htmlFor="e6_firstName">First Name</label>
              <Text type="text" id="e6_firstName" name="profile.firstName" hideError />
              <FieldError name="profile.firstName" className="add-some-error-class" />

              <label htmlFor="e6_lastName">Last Name</label>
              <Text type="text" id="e6_lastName" name="profile.lastName" />

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

export default ExampleCustomErrors;
