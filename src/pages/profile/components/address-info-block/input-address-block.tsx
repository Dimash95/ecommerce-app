import React, { InputHTMLAttributes } from 'react';
import style from '../info-block.module.scss';
import classNames from 'classnames';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isEdit?: boolean;
  addressIndex?: number;
  labelText: string;
  errors: {
    addressName: string;
    city: string;
    streetName: string;
    postalCode: string;
    [key: string]: string;
  };
}

const InputAddressBlock = ({ id, value, isEdit, labelText, name, onChange, errors, addressIndex }: InputProps) => {
  if (name) {
    return (
      <div className={style.inputBlock}>
        <label htmlFor={id}>{labelText}</label>
        <input
          className={classNames('input', errors[name] ? style.error : '')}
          type="text"
          id={id}
          name={name}
          value={value}
          disabled={!isEdit}
          onChange={onChange}
          data-address-index={addressIndex}
        />
        {errors[name] ? <span className={style.error}>{errors[name]}</span> : ''}
      </div>
    );
  }
};

export default InputAddressBlock;
