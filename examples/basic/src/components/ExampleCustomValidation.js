import React from 'react';
import { Form, Validator, Text } from 'react-uforms';
import BaseExample from './BaseExample';

const code = `import { Form, Text } from 'react-uforms';
    
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
);`;

const ExampleCustomValidation = ({ id }) => (
  <BaseExample title="Custom validation" id={id} code={code}>
    {({ onError, onSubmit }) => (
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
        onSubmit={onSubmit}
        onError={onError}
      >
        <label htmlFor="e3_email">Email</label>
        <Text type="text" id="e3_email" name="email" />

        <label htmlFor="e3_password">Password</label>
        <Text type="password" id="e3_password" name="password" />

        <label htmlFor="e3_password2">Retype Password</label>
        <Text type="password" id="e3_password2" name="password2" />

        <button type="submit">Submit</button>
      </Form>
    )}
  </BaseExample>
);

export default ExampleCustomValidation;
