import React from 'react';
import { Form, Validator, Text, FieldError } from 'react-uforms';
import BaseExample from './BaseExample';

const code = `import { Form, Text, FieldError } from 'react-uforms';
    
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
);`;

const ExampleCustomErrors = ({ id }) => (
  <BaseExample title="Errors customization" id={id} code={code}>
    {({ onError, onSubmit }) => (
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
        onSubmit={onSubmit}
        onError={onError}
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
    )}
  </BaseExample>
);

export default ExampleCustomErrors;
