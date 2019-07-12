import React, { Component } from 'react';
import CodeJsx from './CodeJsx';
import CodeJson from './CodeJson';

const toKebabCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)
    .map(x => x.toLowerCase())
    .join('-');

class BaseExample extends Component {
  state = {
    values: null,
    errors: null,
  };

  onError = errors => {
    this.setState({
      errors,
      values: null,
    });
  };

  onSubmit = values => {
    this.setState({
      errors: null,
      values,
    });
  };

  render() {
    const { values, errors } = this.state;
    const { children, title, id, code } = this.props;
    const { onError, onSubmit } = this;
    const name = toKebabCase(title);

    return (
      <div id={name} data-title={title} className="example">
        <h4>
          {id}. {title}
          <a href={`#${name}`} className="anchor" aria-label={title} aria-hidden="true" id={`anchor-${id}`}>
            #
          </a>
        </h4>
        <div className="row">
          <div className="col-md-6">{children({ onError, onSubmit })}</div>
          <div className="col-md-6">
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
        <hr />
      </div>
    );
  }
}

export default BaseExample;
