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
        onBlur: PropTypes.func,
    };

    static defaultProps = {
        onChange: () => {},
        onBlur: () => {},
    };

    onChange = event => {
        if (!event.target.checked) {
            return;
        }
        event.persist();
        const { setValue, onChange } = this.props;
        setValue(event.target.value, () => {
            if (onChange) {
                onChange(event);
            }
        });
    };

    onBlur = event => {
        const { setTouched, onBlur } = this.props;
        event.persist();
        setTouched(() => {
            if (onBlur) {
                onBlur(event);
            }
        });
    };

    render(){
        const { name, children, getValue } = this.props;
        const childApi = {
            name,
            getValue,
            onChange: this.onChange,
            onBlur: this.onBlur,
        };
        return <RadioGroupContext.Provider value={childApi}>{children}</RadioGroupContext.Provider>;
    }
}

export default Field(RadioGroup);
