import React from 'react';
import { Form, CustomField } from 'react-uforms';
import BaseExample from './BaseExample';

const code = `import { Form, CustomField } from 'react-uforms';

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
);`;

const ExampleCustomField = ({ id }) => (
  <BaseExample title="Custom field" id={id} code={code}>
    {({ onSubmit }) => (
      <Form
        onSubmit={onSubmit}
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
    )}
  </BaseExample>
);

export default ExampleCustomField;
