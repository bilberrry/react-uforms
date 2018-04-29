import React, { Component } from 'react';
import { Form, Validator, Text, TextArea } from 'react-uforms'
import Code from './Code';
import Json from './Json';

class ExamplePreFilledForm extends Component {

  state = {
    values: null,
    errors: null,
    code: `import { Form, Text, TextArea } from 'react-uforms'
    
const example = (
  <Form
    values={{
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
);`,
  };

  render() {
    const { code, values, errors } = this.state;

    return (
      <div id="pre-filled-form">
        <h4>4. Pre-filled form <a href="#pre-filled-form" className="anchor" aria-label="anchor" aria-hidden="true">#</a></h4>
        <div className="row">
          <div className="col-6">
            <Form
              values={{
                id: 1,
                email: 'foo.bar@example.com',
                profile: {
                  firstName: 'Foo',
                  lastName: 'Bar',
                  bio: 'Travel blogger',
                },
                createdAt: '2018-04-25T20:36:02+00:00'
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
              <label htmlFor="e4_email">Email</label>
              <Text type="text" id="e4_email" name="email" />

              <label htmlFor="e4_firstName">First Name</label>
              <Text type="text" id="e4_firstName" name="profile.firstName" />

              <label htmlFor="e4_lastName">Last Name</label>
              <Text type="text" id="e4_lastName" name="profile.lastName" />

              <label htmlFor="e4_bio">Bio</label>
              <TextArea id="e4_bio" name="profile.bio" />

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

export default ExamplePreFilledForm;
