import React from 'react';
import { Form, Validator, Text, Select, TextArea, RadioGroup, RadioGroupItem, Checkbox } from 'react-uforms';
import BaseExample from './BaseExample';

const code = `import { 
  Form,
  Validator,
  Text,
  Select,
  TextArea,
  RadioGroup,
  RadioGroupItem,
  Checkbox } from 'react-uforms';
    
const example = (
  <Form
    defaultValues={{
      email: 'foo.bar@example.com',
      country: 'US',
      bio: 'Travel blogger',
      gender: 'male',
      newsletter: 0,
    }}
    validation={() => ({
      email: [
        Validator.Required(),
        Validator.Email(),
      ],
      country: [
        Validator.Required(),
        Validator.Range(['US', 'CA']),
      ],
      gender: [
        Validator.Required(),
        Validator.Range(['male', 'female']),
      ],
      bio: [
        Validator.MaxLength(200),
      ],
      newsletter: [
        Validator.Required(),
        Validator.Range([1, 0]),
      ],
    })}
    onSubmit={values => console.log(values)}
    onError={errors => console.log(errors)}
  >
    <label htmlFor="email">Email</label>
    <Text id="email" name="email" disabled={true} />

    <label htmlFor="password">Password</label>
    <Text type="password" id="password" name="password" />

    <label htmlFor="country">Country</label>
    <Select
      id="country"
      name="country"
      options={[
        { value: null, name: 'Select country' },
        { value: 'US', name: 'United States' },
        { value: 'CA', name: 'Canada' },
        { value: 'UK', name: 'United Kingdom', disabled: true }
      ]}
    />

      <div className="radio-group">
        <RadioGroup name="gender">
          <div className="radio">
            <RadioGroupItem value="male" id="e7_gender_male" />
            <label htmlFor="e7_gender_male">Male</label>
          </div>
          <div className="radio">
            <RadioGroupItem value="female" id="e7_gender_female" />
            <label htmlFor="e7_gender_female">Female</label>
          </div>
        </RadioGroup>
      </div>

    <label htmlFor="bio">Bio</label>
    <TextArea id="bio" name="bio" emptyValue={null} />

    <div className="checkbox-group">
      <div className="checkbox">
        <Checkbox name="newsletter" onValue={1} offValue={0} id="newsletter" />
        <label htmlFor="newsletter">Receive Weekly Updates</label>
      </div>
    </div>
    
    <button type="submit">Submit</button>
  </Form>
);`;

const ExampleAllFields = ({ id }) => (
  <BaseExample title="All fields" id={id} code={code}>
    {({ onError, onSubmit }) => (
      <Form
        defaultValues={{
          email: 'foo.bar@example.com',
          country: 'US',
          bio: 'Travel blogger',
          gender: 'male',
          newsletter: 0,
        }}
        validation={() => ({
          email: [Validator.Required(), Validator.Email()],
          country: [Validator.Required(), Validator.Range(['US', 'CA'])],
          gender: [Validator.Required(), Validator.Range(['male', 'female'])],
          bio: [Validator.MaxLength(200)],
          newsletter: [Validator.Required(), Validator.Range([1, 0])],
        })}
        onSubmit={onSubmit}
        onError={onError}
      >
        <label htmlFor="e7_email">Email</label>
        <Text id="e7_email" name="email" disabled />

        <label htmlFor="e7_password">Password</label>
        <Text type="password" id="e7_password" name="password" />

        <label htmlFor="e7_country">Country</label>
        <Select
          id="e7_country"
          name="country"
          options={[
            { value: null, name: 'Select country' },
            { value: 'US', name: 'United States' },
            { value: 'CA', name: 'Canada' },
            { value: 'UK', name: 'United Kingdom', disabled: true },
          ]}
        />

        <div className="radio-group">
          <RadioGroup name="gender">
            <div className="radio">
              <RadioGroupItem value="male" id="e7_gender_male" />
              <label htmlFor="e7_gender_male">Male</label>
            </div>
            <div className="radio">
              <RadioGroupItem value="female" id="e7_gender_female" />
              <label htmlFor="e7_gender_female">Female</label>
            </div>
          </RadioGroup>
        </div>

        <label htmlFor="e7_bio">Bio</label>
        <TextArea id="e7_bio" name="bio" emptyValue={null} />

        <div className="checkbox-group">
          <div className="checkbox">
            <Checkbox name="newsletter" onValue={1} offValue={0} id="e7_newsletter" />
            <label htmlFor="e7_newsletter">Receive Weekly Updates</label>
          </div>
        </div>

        <button type="submit">Submit</button>
      </Form>
    )}
  </BaseExample>
);

export default ExampleAllFields;
