import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { RadioGroupContext } from '../FormContext';

export default class RadioGroupItem extends Component {
    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
    };

    static defaultProps = {
        onChange: () => {},
        onBlur: () => {},
    };

    render() {
        const {value, ...props} = this.props;
        return (
            <RadioGroupContext.Consumer>
                {({ name, getValue, onChange, onBlur }) => {
                    return (
                        <input
                            {...props}
                            name={name}
                            type="radio"
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            checked={value == getValue(name)}
                        />
                    )
                }}
            </RadioGroupContext.Consumer>
        );
    }
}
