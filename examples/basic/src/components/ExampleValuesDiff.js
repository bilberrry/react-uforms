import React from 'react';
import { Form, Text, TextArea, Validator } from 'react-uforms';
import BaseExample from './BaseExample';

const code = `import { Form, Text, TextArea, Validator } from 'react-uforms';

const example = (
  <Form
    defaultValues={{
      id: 1,
      email: 'foo.bar@example.com',
      profile: {
        firstName: 'Foo',
        lastName: 'Bar',
        bio: 'Travel blogger',
      },
      createdAt: '2018-04-25T20:36:02+00:00',
    }}
    validation={() => ({
      email: [Validator.Required(), Validator.Email()],
      profile: {
        firstName: [Validator.Required(), Validator.MinLength(2), Validator.MaxLength(20)],
        lastName: [Validator.Required(), Validator.MinLength(2), Validator.MaxLength(20)],
        bio: [Validator.MaxLength(200)],
      },
    })}
    onSubmit={(values, { getValuesDiff }) => console.log(getValuesDiff())}
    onError={errors => console.log(errors)}
  >
    <label htmlFor="email">Email</label>
    <Text type="text" id="email" name="email" />

    <label htmlFor="firstName">First Name</label>
    <Text type="text" id="firstName" name="profile.firstName" />

    <label htmlFor="lastName">Last Name</label>
    <Text type="text" id="lastName" name="profile.lastName" />

    <label htmlFor="bio">Bio</label>
    <TextArea id="bio" name="profile.bio" />

    <button type="submit">Submit</button>
  </Form>
);`;

const ExampleValuesDiff = ({ id }) => (
  <BaseExample title="Values difference" id={id} code={code}>
    {({ onError, onSubmit }) => (
      <Form
        defaultValues={{
          id: 1,
          email: 'foo.bar@example.com',
          profile: {
            firstName: 'Foo',
            lastName: 'Bar',
            bio: 'Travel blogger',
          },
          createdAt: '2018-04-25T20:36:02+00:00',
        }}
        validation={() => ({
          email: [Validator.Required(), Validator.Email()],
          profile: {
            firstName: [Validator.Required(), Validator.MinLength(2), Validator.MaxLength(20)],
            lastName: [Validator.Required(), Validator.MinLength(2), Validator.MaxLength(20)],
            bio: [Validator.MaxLength(200)],
          },
        })}
        onSubmit={(formValues, { getValuesDiff }) => {
          onSubmit(getValuesDiff());
        }}
        onError={onError}
      >
        <label htmlFor="e8_email">Email</label>
        <Text type="text" id="e8_email" name="email" />

        <label htmlFor="e8_firstName">First Name</label>
        <Text type="text" id="e8_firstName" name="profile.firstName" />

        <label htmlFor="e8_lastName">Last Name</label>
        <Text type="text" id="e8_lastName" name="profile.lastName" />

        <label htmlFor="e8_bio">Bio</label>
        <TextArea id="e8_bio" name="profile.bio" />

        <button type="submit">Submit</button>
      </Form>
    )}
  </BaseExample>
);

export default ExampleValuesDiff;
