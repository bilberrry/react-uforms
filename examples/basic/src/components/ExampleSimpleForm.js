import React from 'react';
import { Form, Text } from 'react-uforms';
import BaseExample from './BaseExample';

const code = `import { Form, Text } from 'react-uforms';

const example = (
  <Form onSubmit={values => console.log(values)}>
    <label htmlFor="email">Email</label>
    <Text type="text" id="email" name="email" />
    
    <label htmlFor="password">Password</label>
    <Text type="password" id="password" name="password" />
    
    <button type="submit">Submit</button>
  </Form>
);`;

const ExampleSimpleForm = ({ id }) => (
  <BaseExample title="Simple form" id={id} code={code}>
    {({ onSubmit }) => (
      <Form onSubmit={onSubmit}>
        <label htmlFor="e1_email">Email</label>
        <Text type="text" id="e1_email" name="email" />

        <label htmlFor="e1_password">Password</label>
        <Text type="password" id="e1_password" name="password" />

        <button type="submit">Submit</button>
      </Form>
    )}
  </BaseExample>
);

export default ExampleSimpleForm;
