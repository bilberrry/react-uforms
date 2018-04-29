import React, { Component, Fragment } from 'react';
import { Form, Validator, Text, Select } from 'react-uforms'
import Code from './Code';
import Json from './Json';

class ExampleDynamicForm extends Component {

  state = {
    values: null,
    errors: null,
    code: `import { Form, Text, Select } from 'react-uforms'
    
const example = (
  <Form
    values={{
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
        state: [
          ...(getValue('address.country') === 'US' ? [Validator.Required()] : []),
          Validator.Range(['WA', 'OR', 'CA']),
        ],
        city: [
          Validator.Required(),
          Validator.MaxLength(30),
        ],
      },
    })}
    onSubmit={values => console.log(values)}
    onError={errors => console.log(errors)}
  >
    {({ getValue, setValue }) => (
      <Fragment>
        <label htmlFor="country">Country</label>
        <Select
          id="country"
          name="address.country"
          onChange={() => {
            if (getValue('address.country') !== 'US') {
              setValue('address.state', '');
            }
          }}
          options={[
            { value: '', name: 'Select country' },
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
              { value: '', name: 'Select state' },
              { value: 'WA', name: 'Washington' },
              { value: 'CA', name: 'California' },
              { value: 'OR', name: 'Oregon' }
            ]}
          />
        </Fragment>}

        <label htmlFor="city">City</label>
        <Text type="text" id="city" name="address.city" />

        <button type="submit">Submit</button>
      </Fragment>
    )}
  </Form>
);`,
  };

  render() {
    const { code, values, errors } = this.state;

    return (
      <div id="dynamic-form">
        <h4>5. Dynamic form <a href="#dynamic-form" className="anchor" aria-label="anchor" aria-hidden="true">#</a></h4>
        <div className="row">
          <div className="col-6">
            <Form
              values={{
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
                  state: [
                    ...(getValue('address.country') === 'US' ? [Validator.Required()] : []),
                    Validator.Range(['WA', 'OR', 'CA']),
                  ],
                  city: [
                    Validator.Required(),
                    Validator.MaxLength(30),
                  ],
                },
              })}
              onSubmit={(values) => {
                this.setState({
                  errors: null,
                  values,
                })
              }}
              onError={(errors) => {
                this.setState({
                  errors,
                  values: null,
                })
              }}
            >
            {({ getValue, setValue }) => (
              <Fragment>
                <label htmlFor="e5_country">Country</label>
                <Select
                  id="e5_country"
                  name="address.country"
                  onChange={() => {
                    if (getValue('address.country') !== 'US') {
                      setValue('address.state', '');
                    }
                  }}
                  options={[
                    { value: '', name: 'Select country' },
                    { value: 'US', name: 'United States' },
                    { value: 'CA', name: 'Canada' },
                    { value: 'UK', name: 'United Kingdom - coming soon', disabled: true }
                  ]}
                />

                {getValue('address.country') === 'US' && <Fragment>
                  <label htmlFor="e5_state">State</label>
                  <Select
                    id="e5_state"
                    name="address.state"
                    options={[
                      { value: '', name: 'Select state' },
                      { value: 'WA', name: 'Washington' },
                      { value: 'CA', name: 'California' },
                      { value: 'OR', name: 'Oregon' }
                    ]}
                  />
                </Fragment>}

                <label htmlFor="e5_city">City</label>
                <Text type="text" id="e5_city" name="address.city" />

                <button type="submit">Submit</button>
              </Fragment>
            )}
            </Form>
          </div>
          <div className="col-4">
            {values && <div>
              <samp>onSubmit <small>log</small></samp>
              <Json value={values} />
            </div>}
            {errors && <div>
              <samp>onError <small>log</small></samp>
              <Json value={errors} />
            </div>}
          </div>
        </div>
        <Code value={code} />
      </div>
    );
  }
}

export default ExampleDynamicForm;
