import React, { Component, Fragment } from 'react';
import { Form, Validator, Text, Select } from 'react-uforms';
import CodeJsx from './CodeJsx';
import CodeJson from './CodeJson';

class ExampleDynamicForm extends Component {
  state = {
    values: null,
    errors: null,
    code: `import { Form, Text, Select } from 'react-uforms'
    
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
        <h4>
          5. Dynamic form{' '}
          <a href="#dynamic-form" className="anchor" aria-label="anchor" aria-hidden="true">
            #
          </a>
        </h4>
        <div className="row">
          <div className="col-6">
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
                  state: [
                    ...(getValue('address.country') === 'US' ? [Validator.Required()] : []),
                    Validator.Range(['WA', 'OR', 'CA']),
                  ],
                  city: [Validator.Required(), Validator.MaxLength(30)],
                },
              })}
              onSubmit={formValues => {
                this.setState({
                  errors: null,
                  values: formValues,
                });
              }}
              onError={formErrors => {
                this.setState({
                  errors: formErrors,
                  values: null,
                });
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

                  <button type="submit">Submit</button>
                </Fragment>
              )}
            </Form>
          </div>
          <div className="col-4">
            {values && (
              <div>
                <samp>
                  onSubmit <small>log</small>
                </samp>
                <CodeJson value={values} />
              </div>
            )}
            {errors && (
              <div>
                <samp>
                  onError <small>log</small>
                </samp>
                <CodeJson value={errors} />
              </div>
            )}
          </div>
        </div>
        <CodeJsx value={code} />
      </div>
    );
  }
}

export default ExampleDynamicForm;
