# react-uforms
[![npm version](https://badge.fury.io/js/react-uforms.svg)](https://badge.fury.io/js/react-uforms)
![TypeScript](https://img.shields.io/npm/types/typescript)
[![build status](https://travis-ci.org/summerua/react-uforms.svg?branch=master)](https://travis-ci.org/summerua/react-uforms)
[![codecov](https://codecov.io/gh/summerua/react-uforms/branch/master/graph/badge.svg)](https://codecov.io/gh/summerua/react-uforms)
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
  <Form onSubmit={values => console.log(values)}>
    <label htmlFor="email">Email</label>
    <Text type="text" id="email" name="email" />
    
    <label htmlFor="password">Password</label>
    <Text type="password" id="password" name="password" />
    
    <button type="submit">Submit</button>
  </Form>
);
```
[Demo](http://react-uforms.d3v.me#simple-example)

### 2. Validation
```jsx
import { Form, Text } from 'react-uforms';
    
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
        Validator.Preg(/^(?=.*\d+).+$/, 'At least 1 numeric character'),
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
);
```
[Demo](http://react-uforms.d3v.me#validation)

### 3. Custom validation
```jsx
import { Form, Text } from 'react-uforms';
    
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
        Validator.Preg(/^(?=.*\d+).+$/, 'At least 1 numeric character'),
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
);
```
[Demo](http://react-uforms.d3v.me#custom-validation)

### 4. Pre-filled form
```jsx
import { Form, Text, TextArea } from 'react-uforms';
    
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
        bio: [
          Validator.MaxLength(200)
        ]
      },
    })}
    onSubmit={values => console.log(values)}
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
);
```
[Demo](http://react-uforms.d3v.me#pre-filled-form)

### 5. Dynamic form
```jsx
import { Form, Text, Select, Validator } from 'react-uforms';
    
const example = (
  <Form
    defaultValues={{
      id: 1,
      email: 'foo.bar@example.com',
      address: {
        country: 'US',
        state: 'WA',
        city: 'Seattle',
      },
    }}
    validation={({ getValue }) => ({
      address: {
        country: [
          Validator.Required(),
          Validator.Range(['US', 'CA']),
        ],
        state:
          getValue('address.country') === 'US'
            ? [Validator.Required(), Validator.Range(['WA', 'OR', 'CA'])]
            : [],
        city: [
          Validator.Required(),
          Validator.MaxLength(30),
        ],
      },
    })}
    onSubmit={values => console.log(values)}
    onError={errors => console.log(errors)}
  >
    {({ getValue, setValue, isChanged }) => (
      <Fragment>
        <label htmlFor="country">Country</label>
        <Select
          id="country"
          name="address.country"
          onChange={() => {
            if (getValue('address.country') !== 'US') {
              setValue('address.state', null);
            }
          }}
          options={[
            { value: null, name: 'Select country' },
            { value: 'US', name: 'United States' },
            { value: 'CA', name: 'Canada' },
            { value: 'UK', name: 'United Kingdom - coming soon', disabled: true }
          ]}
        />

        {getValue('address.country') === 'US' && <Fragment>
          <label htmlFor="state">State</label>
          <Select
            id="state"
            name="address.state"
            options={[
              { value: null, name: 'Select state' },
              { value: 'WA', name: 'Washington' },
              { value: 'CA', name: 'California' },
              { value: 'OR', name: 'Oregon' }
            ]}
          />
        </Fragment>}

        <label htmlFor="city">City</label>
        <Text type="text" id="city" name="address.city" />

        <button type="submit" disabled={!isChanged()}>
          Submit
        </button>
      </Fragment>
    )}
  </Form>
);
```
[Demo](http://react-uforms.d3v.me#pre-filled-form)

### 6. Errors customization
```jsx
import { Form, Text, FieldError } from 'react-uforms';
    
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
    classes={{
      field: {
        error: "your-error-class",
        invalid: "your-invalid-input-class",
      },
    }}
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
);
```
[Demo](http://react-uforms.d3v.me#errors-customization)

### 7. All fields
```jsx
import { Form, Validator, Text, Select, TextArea, RadioGroup, RadioGroupItem, Checkbox } from 'react-uforms';
    
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
);
```
[Demo](http://react-uforms.d3v.me#values-diff-example)

### 8. Get values difference
```jsx
import { Form, Text, TextArea, Validator } from 'react-uforms';

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
);
```
[Demo](http://react-uforms.d3v.me#custom-field-example)

### 9. Custom field
```jsx
import { Form, CustomField } from 'react-uforms';

const example = (
  <Form
    onSubmit={values => console.log(values)}
    defaultValues={{
      timestamp: 1562457600,
    }}
  >
    <CustomField name="timestamp">
      {({ setValue, getValue }) => (
        <input
          type="date"
          value={new Date(+getValue() * 1000).toISOString().split('T')[0]}
          onChange={e => {
            const { value } = e.target;
            setValue(value ? Math.round(+new Date(value) / 1000) : null);
          }}
        />
      )}
    </CustomField>

    <button type="submit">Submit</button>
  </Form>
);
```

## Upgrading from 0.3

### Braking changes
1. Renamed `values` (`Form` attribute) to `defaultValues`;
```diff
<Form
-  values={...}
+  defaultValues={...}
...
```
2. Migrated to strong `===` comparison for checked/selected values;
3. Added type support for `Select` / `Radio` / `RadioGroup` values;
4. Refactored/fixed all validators;
5. Deleted `isUpdatesOnly` (`Form` attribute). Use [getValuesDiff()](http://react-uforms.d3v.me#values-diff-example) instead.

## Authors

* **Bohdan Protsiuk** - [summerua](https://github.com/summerua)

## License

MIT License - see the [LICENSE](LICENSE) file for details
