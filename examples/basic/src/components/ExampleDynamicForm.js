import React, { Fragment } from 'react';
import { Form, Validator, Text, Select } from 'react-uforms';
import BaseExample from './BaseExample';

const code = `import { Form, Text, Select, Validator } from 'react-uforms'
    
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
    {({ getValue, setValue, hasChanges }) => (
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

        <button type="submit" disabled={!hasChanges()}>
          Submit
        </button>
      </Fragment>
    )}
  </Form>
);`;

const ExampleDynamicForm = ({ id }) => (
  <BaseExample title="Dynamic form" id={id} code={code}>
    {({ onError, onSubmit }) => (
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
            country: [Validator.Required(), Validator.Range(['US', 'CA'])],
            state:
              getValue('address.country') === 'US' ? [Validator.Required(), Validator.Range(['WA', 'OR', 'CA'])] : [],
            city: [Validator.Required(), Validator.MaxLength(30)],
          },
        })}
        onSubmit={onSubmit}
        onError={onError}
      >
        {({ getValue, setValue, hasChanges }) => (
          <Fragment>
            <label htmlFor="e5_country">Country</label>
            <Select
              id="e5_country"
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
                { value: 'UK', name: 'United Kingdom - coming soon', disabled: true },
              ]}
            />

            {getValue('address.country') === 'US' && (
              <Fragment>
                <label htmlFor="e5_state">State</label>
                <Select
                  id="e5_state"
                  name="address.state"
                  options={[
                    { value: null, name: 'Select state' },
                    { value: 'WA', name: 'Washington' },
                    { value: 'CA', name: 'California' },
                    { value: 'OR', name: 'Oregon' },
                  ]}
                />
              </Fragment>
            )}

            <label htmlFor="e5_city">City</label>
            <Text type="text" id="e5_city" name="address.city" />

            <button type="submit" disabled={!hasChanges()}>
              Submit
            </button>
          </Fragment>
        )}
      </Form>
    )}
  </BaseExample>
);

export default ExampleDynamicForm;
