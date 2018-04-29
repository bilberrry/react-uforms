import React, { Component } from 'react';
import { Form, Validator, Text, Select, TextArea, Radio, Checkbox, FieldError } from 'react-uforms'
import Code from './Code';
import Json from './Json';

class ExampleAllFields extends Component {

  state = {
    values: null,
    errors: null,
    code: `import { Form, Validator, Text, Select, TextArea, Radio, Checkbox, FieldError } from 'react-uforms'
    
const example = (
  <Form
    values={{
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
    <label htmlFor="email">Email</label>
    <Text id="email" name="email" disabled={true} />

    <label htmlFor="password">Password</label>
    <Text type="password" id="password" name="password" />

    <label htmlFor="country">Country</label>
    <Select
      id="country"
      name="country"
      options={[
        { value: '', name: 'Select country' },
        { value: 'US', name: 'United States' },
        { value: 'CA', name: 'Canada' },
        { value: 'UK', name: 'United Kingdom', disabled: true }
      ]}
    />

    <div className="checkbox-group">
      <label>Gender</label>
      <div className="checkbox">
        <Radio name="gender" value="male" type="radio" id="male" />
        <label htmlFor="male">Male</label>
      </div>
      <div className="checkbox">
        <Radio name="gender" value="female" type="radio" id="female" />
        <label htmlFor="female">Female</label>
      </div>
      <FieldError name="gender" />
    </div>

    <label htmlFor="bio">Bio</label>
    <TextArea id="bio" name="bio" />

    <div className="radio-group">
      <div className="radio">
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
        <h4>7. All fields <a href="#all-fields" className="anchor" aria-label="anchor" aria-hidden="true">#</a></h4>
        <div className="row">
          <div className="col-6">
            <Form
              values={{
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
              <label htmlFor="e7_email">Email</label>
              <Text id="e7_email" name="email" disabled={true} />

              <label htmlFor="e7_password">Password</label>
              <Text type="password" id="e7_password" name="password" />

              <label htmlFor="e7_country">Country</label>
              <Select
                id="e7_country"
                name="country"
                options={[
                  { value: '', name: 'Select country' },
                  { value: 'US', name: 'United States' },
                  { value: 'CA', name: 'Canada' },
                  { value: 'UK', name: 'United Kingdom', disabled: true }
                ]}
              />

              <div className="checkbox-group">
                <label>Gender</label>
                <div className="checkbox">
                  <Radio name="gender" value="male" type="radio" id="e7_male" />
                  <label htmlFor="e7_male">Male</label>
                </div>
                <div className="checkbox">
                  <Radio name="gender" value="female" type="radio" id="e7_female" />
                  <label htmlFor="e7_female">Female</label>
                </div>
                <FieldError name="gender" />
              </div>

              <label htmlFor="e7_bio">Bio</label>
              <TextArea id="e7_bio" name="bio" />

              <div className="radio-group">
                <div className="radio">
                  <Checkbox name="newsletter" onValue={1} offValue={0} id="e7_newsletter" />
                  <label htmlFor="e7_newsletter">Receive Weekly Updates</label>
                </div>
              </div>

              <button type="submit">Submit</button>
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

export default ExampleAllFields;
