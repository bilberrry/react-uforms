import React, { Component } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

class Json extends Component {
  render() {
    return (
      <pre>
        <code
          className="language-json"
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(JSON.stringify(this.props.value, null, 2), Prism.languages.json, 'json'),
          }}
        />
      </pre>
    );
  }
}

export default Json;
