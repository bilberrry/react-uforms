import React, { Component } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';

class Code extends Component {
  render() {
    return (
      <pre>
        <code
          className="language-jsx"
          dangerouslySetInnerHTML={{ __html: Prism.highlight(this.props.value, Prism.languages.jsx, 'jsx') }}
        />
      </pre>
    );
  }
}

export default Code;
