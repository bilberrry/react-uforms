import React, { Component } from 'react';
import { Form, Validator, Text, Select, TextArea, RadioGroup, RadioGroupItem, Checkbox } from 'react-uforms';
import CodeJsx from './CodeJsx';
import CodeJson from './CodeJson';

class ExampleAllFields extends Component {
  state = {
    values: null,
    errors: null,
    code: `import { Form, Validator, Text, Select, TextArea, RadioGroup, RadioGroupItem, Checkbox } from 'react-uforms';
    
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
    onSubmit={values => {
      this.setState({
        errors: null,
        values,
      })
    }}
    onError={errors => {
      this.setState({
        errors,
        values: null,
      })
    }}
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
        <RadioGroupItem value="male" id="gender_male"  />
        <label htmlFor="gender_male">Male</label>
        <RadioGroupItem value="female" id="gender_female"  />
        <label htmlFor="gender_female">Female</label>
      </RadioGroup>
    </div>

    <label htmlFor="bio">Bio</label>
    <TextArea id="bio" name="bio" />

    <div className="checkbox-group">
      <div className="checkbox">
        <Checkbox name="newsletter" onValue={1} offValue={0} id="newsletter" />
        <label htmlFor="newsletter">Receive Weekly Updates</label>
      </div>
    </div>
    
    <button type="submit">Submit</button>
  </Form>
);`,
  };

  render() {
    const { code, values, errors } = this.state;

    return (
      <div id="all-fields">
        <h4>
          7. All fields{' '}
          <a href="#all-fields" className="anchor" aria-label="anchor" aria-hidden="true">
            #
          </a>
        </h4>
        <div className="row">
          <div className="col-6">
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
                  <RadioGroupItem value="male" id="e7_gender_male" />
                  <label htmlFor="e7_gender_male">Male</label>
                  <RadioGroupItem value="female" id="e7_gender_female" />
                  <label htmlFor="e7_gender_female">Female</label>
                </RadioGroup>
              </div>

              <label htmlFor="e7_bio">Bio</label>
              <TextArea id="e7_bio" name="bio" />

              <div className="checkbox-group">
                <div className="checkbox">
                  <Checkbox name="newsletter" onValue={1} offValue={0} id="e7_newsletter" />
                  <label htmlFor="e7_newsletter">Receive Weekly Updates</label>
                </div>
              </div>

              <button type="submit">Submit</button>
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

export default ExampleAllFields;
