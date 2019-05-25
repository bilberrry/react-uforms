import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';

const CodeJsx = ({ value }) => (
  <pre>
    <code
      className="language-jsx"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: Prism.highlight(value, Prism.languages.jsx, 'jsx') }}
    />
  </pre>
);

export default CodeJsx;
