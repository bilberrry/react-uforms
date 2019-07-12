import React from 'react';
import { Form, Validator, Text } from 'react-uforms';
import BaseExample from './BaseExample';

const code = `import { Form, Text } from 'react-uforms';
    
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
);`;

const ExampleValidation = ({ id }) => (
  <BaseExample title="Validation" id={id} code={code}>
    {({ onError, onSubmit }) => (
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
        onSubmit={onSubmit}
        onError={onError}
      >
        <label htmlFor="e2_email">Email</label>
        <Text type="text" id="e2_email" name="email" />

        <label htmlFor="e2_password">Password</label>
        <Text type="password" id="e2_password" name="password" />

        <button type="submit">Submit</button>
      </Form>
    )}
  </BaseExample>
);

export default ExampleValidation;
