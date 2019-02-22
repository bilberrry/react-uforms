import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { RadioGroupContext } from '../FormContext';

export default class Radio extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  };

  render() {
    const {id, value, ...props} = this.props;
    return (
        <RadioGroupContext.Consumer>
          {({name, chosenItem, getValue}) => {
            return (
                <input
                    {...props}
                    id={id}
                    name={name}
                    type="radio"
                    onChange={event => chosenItem(event.target.value)}
                    value={value}
                    checked={Number.isInteger(value) ? value === +getValue(name) : value === getValue(name)}
                />
            );
          }}
        </RadioGroupContext.Consumer>
    );
  }
}
