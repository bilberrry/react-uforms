import React, { Component } from 'react';
import { Form, CustomField } from 'react-uforms';
import CodeJsx from './CodeJsx';
import CodeJson from './CodeJson';

class ExampleCustomField extends Component {
  state = {
    values: null,
    code: `import { Form, CustomField } from 'react-uforms';

const example = (
  <Form
    onSubmit={values => console.log(values)}
  >
    <CustomField name="utc_date">
      {({ setValue }) => (
        <input
          type="date"
          onChange={e => {
            e.preventDefault();
            const { value } = e.target;
            setValue(value ? new Date(value).toUTCString() : null);
          }}
        />
      )}
    </CustomField>

    <button type="submit">Submit</button>
  </Form>
);`,
  };

  render() {
    const { code, values } = this.state;
    return (
      <div id="custom-field-example">
        <h4>
          9. Custom field{' '}
          <a href="#custom-field-example" className="anchor" aria-label="anchor" aria-hidden="true">
            #
          </a>
        </h4>
        <div className="row">
          <div className="col-6">
            <Form
              onSubmit={formValues => {
                this.setState({
                  values: formValues,
                });
              }}
            >
              <CustomField name="utc_date">
                {({ setValue }) => (
                  <input
                    type="date"
                    onChange={e => {
                      e.preventDefault();
                      const { value } = e.target;
                      setValue(value ? new Date(value).toUTCString() : null);
                    }}
                  />
                )}
              </CustomField>

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
          </div>
        </div>
        <CodeJsx value={code} />
      </div>
    );
  }
}

export default ExampleCustomField;
