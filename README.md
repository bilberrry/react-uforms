# react-uforms
[![npm version](https://badge.fury.io/js/react-uforms.svg)](https://badge.fury.io/js/react-uforms)
![build status](https://github.com/bilberrry/react-uforms/actions/workflows/workflow.yml/badge.svg?branch=master)
![TypeScript](https://img.shields.io/npm/types/typescript)
![NPM](https://img.shields.io/npm/l/react-uforms.svg)

Simple and elegant forms for your React application.

### Installation
Using Yarn
```bash
yarn add react-uforms
```

Or NPM

```bash
npm install react-uforms --save
```
## Usage

### 1. Simple example
```jsx
import { Form, Text } from 'react-uforms';

const example = (
  <Form onSubmit={(formApi, values) => console.log(values)}>
    <label htmlFor="email">Email</label>
    <Text type="text" id="email" name="email" />
    
    <label htmlFor="password">Password</label>
    <Text type="password" id="password" name="password" />
    
    <button type="submit">Submit</button>
  </Form>
);
```

### 2. Validation
```jsx
import { Form, Text } from 'react-uforms';
import * as yup from 'yup';
    
const example = (
  <Form
    validation={yup.object({
      email: yup.string().required('Email is required').email(),
      password: yup
        .string()
        .required('Password is required')
        .matches(/^(?=.*[a-z]).+$/, 'At least 1 lowercase alphabetical character')
        .matches(/^(?=.*[A-Z]).+$/, 'At least 1 uppercase alphabetical character')
        .matches(/^(?=.*\d+).+$/, 'At least 1 numeric character'),
    })}
    onSubmit={(formApi, values) => console.log(values)}
    onError={(formApi, errors) => console.log(errors)}
  >
    <label htmlFor="email">Email</label>
    <Text type="text" id="email" name="email" />
  
    <label htmlFor="password">Password</label>
    <Text type="password" id="password" name="password" />
  
    <button type="submit">Submit</button>
  </Form>
);
```

### 3. Pre-filled form
```jsx
import { Form, Text, TextArea } from 'react-uforms';
import * as yup from 'yup';
    
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
      createdAt: '2018-04-25T23:36:02+00:00'
    }}
    validation={yup.object({
      email: yup.string().required('Email is required').email(),
      profile: yup.object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        bio: yup.string(),
      }),
    })}
    onSubmit={(formApi, values) => console.log(values)}
    onError={(formApi, errors) => console.log(errors)}
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
);
```

### 4. Errors customization
```jsx
import { Form, Text, FieldError } from 'react-uforms';
import * as yup from 'yup';
    
const example = (
  <Form
    validation={yup.object({
      email: yup.string().required('Email is required').email(),
      profile: yup.object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        bio: yup.string(),
      }),
    })}
    classes={{
      field: {
        error: "your-error-class",
        invalid: "your-invalid-input-class",
      },
    }}
    onSubmit={(formApi, values) => console.log(values)}
    onError={(formApi, errors) => console.log(errors)}
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
);
```

### 5. Other fields
```jsx
import { Form, Text, Select, TextArea, RadioGroup, RadioGroupItem, Checkbox } from 'react-uforms';
    
const example = (
  <Form
    onSubmit={(formApi, values) => console.log(values)}
    onError={(formApi, errors) => console.log(errors)}
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
);
```

### 6. Custom field
```jsx
import { Form, Field } from 'react-uforms';

const example = (
  <Form
    onSubmit={(formApi, values) => console.log(values)}
    defaultValues={{
      email: 'test@example.com',
      profile: {
        isPublic: true,
        firstName: 'John',
        lastName: 'Brown',
      },
    }}
  >
    <Field name="profile.isPublic">
      {({ setValue, getValue }) => (
        <button type="button" onClick={() => setValue(!getValue())}>
          {getValue() ? 'on' : 'off'}
        </button>
      )}
    </Field>
    <button type="submit">Submit</button>
  </Form>
);
```

## Authors

* **Bohdan Protsiuk** - [summerua](https://github.com/summerua)

## License

MIT License - see the [LICENSE](LICENSE) file for details
