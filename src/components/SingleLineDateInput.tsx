import React, { ChangeEvent } from 'react';

import styled from 'styled-components';
import classNames from 'classnames';

const SingleLineDateInputContainer = styled.div`
  width: 100%;
  margin: 0 0 15px 0;
  position: relative;
  &.dark label {
    color: #FFFFFF;
  }
  &.dark input {
    color: #FFFFFF;
    border-bottom-color: #FFFFFF;
  }
  &.readonly input {
    border-bottom-color: transparent;
  }
  &.readonly input:disabled {
    opacity: 1;
    color: inherit;
  }
`;

const Label = styled.label`
  font-size: 14px;
  line-height: 28px;
  color: #666666;
`;

const OptionalLabel = styled(Label)`
  position: absolute;
  top: 1px;
  right: 0;
  color: #999999;
  font-size: 12px;
  line-height: 28px;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  border-top: none;
  border-right: none;
  border-bottom: 1px solid #CCCCCC;
  border-left: none;
  padding: 0 0 5px 0;
  font-family: 'sf_compact_textmedium';
  font-size: 16px;
  line-height: 24px;
  background: none;
  outline: none;
  border-radius: 0;
  &::placeholder {
    color: #AAAAAA;
  }
  &:focus {
    padding-bottom: 4px;
    border-bottom-color: #DBAD82;
    border-bottom-width: 2px;
    border-bottom-styled: solid;
  }
`;

interface SingleLineDateInputProps {
  label?: string;
  value?: string;
  inputStyle?:'normal'|'dark';
  isOptional?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
};

const SingleLineDateInput: React.FC<SingleLineDateInputProps> = (props) => {

  const {
    label,
    value,
    inputStyle,
    isOptional,
    disabled,
    readOnly,
    onChange
  } = props;

  const classes = classNames(
    inputStyle ? inputStyle : undefined,
    {'readonly': readOnly}
  );

  return (
    <SingleLineDateInputContainer className={classes}>
      {label && (!readOnly || (readOnly && value)) &&
        <Label htmlFor={'label-' + label.toLowerCase()}>{label}</Label>
      }
      {isOptional && !readOnly && <OptionalLabel>Optional</OptionalLabel>}
      <Input
        {...(label && {id: 'label-' + label.toLowerCase()})}
        type="date"
        value={value || ''}
        placeholder="YYYY-MM-DD"
        disabled={disabled || readOnly}
        onChange={onChange}
      />
    </SingleLineDateInputContainer>
  )
};

export default SingleLineDateInput;
