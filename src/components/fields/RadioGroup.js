import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { RadioGroupContext } from '../FormContext';
import Field from '../Field';

class RadioGroup extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired,
        getValue: PropTypes.func.isRequired,
        setValue: PropTypes.func.isRequired,
        setTouched: PropTypes.func.isRequired,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        onChange: () => {},
    };

    chosenItem = value => {
        const { setValue, setTouched, onChange } = this.props;
        setValue(value);
        setTouched(() => {
            onChange(value);
        });
    };

    render(){
        const { name, children, getValue } = this.props;
        const radioProps = {
            name,
            chosenItem: this.chosenItem,
            getValue
        };
        return <RadioGroupContext.Provider value={radioProps}>{children}</RadioGroupContext.Provider>;
    }
}

export default Field(RadioGroup);
