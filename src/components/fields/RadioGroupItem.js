import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { RadioGroupContext } from '../FormContext';

export default class RadioGroupItem extends Component {
    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    };

    render() {
        const {value, ...props} = this.props;
        return (
            <RadioGroupContext.Consumer>
                {({ name, chosenItem, getValue }) => {
                    return (
                        <input
                            {...props}
                            name={name}
                            type="radio"
                            onChange={event => chosenItem(event.target.value)}
                            value={value}
                            checked={Number.isInteger(value) ? value === +getValue(name) : value === getValue(name)}
                        />
                    )
                }}
            </RadioGroupContext.Consumer>
        );
    }
}
