import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

const CodeJson = ({ value }) => (
  <pre>
    <code
      className="language-json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(JSON.stringify(value, null, 2), Prism.languages.json, 'json'),
      }}
    />
  </pre>
);

export default CodeJson;
