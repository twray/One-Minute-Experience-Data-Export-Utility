import React, { MouseEvent } from 'react';

import classNames from 'classnames';
import styled from 'styled-components';

const ButtonContainer = styled.button`
  display: block;
  min-width: 160px;
  padding: 0 18px;
  height: 48px;
  border: none;
  border-radius: 6px;
  background-color: #9A7049;
  color: #FFFFFF;
  font-family: 'sf_compact_textmedium';
  font-size: 14px;
  line-height: 18px;
  text-transform: uppercase;
  cursor: pointer;
  outline: none;
  &:disabled {
    opacity: 0.2;
    cursor: default;
  }
  &.primary {
    background-color: #9A7049;
  }
  &.secondary {
    background-color: #2B2D3C;
  }
  &.tertiary {
    background-color: #E23760;
  }
  &.white-transparent {
    background-color: rgba(255, 255, 255, 0.85);
    color: #444444;
  }
  &:active {
    filter: brightness(90%);
  }
  &.sm {
    min-width: 125px;
  }
  &.md {
    min-width: 200px;
  }
  &.lg {
    min-width: 250px;
  }
  &.full {
    width: 100%;
  }
`;

type ButtonStyle = 'primary'|'secondary'|'tertiary'|'white-transparent';
type ButtonSize = 'sm'|'md'|'lg'|'full';

interface ButtonProps {
  text: string;
  buttonStyle?: ButtonStyle,
  buttonSize?: ButtonSize,
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const Button: React.FC<ButtonProps> = (props) => {
  const { text, buttonStyle, buttonSize, disabled, onClick } = props;
  return (
    <ButtonContainer
      className={classNames(buttonStyle, buttonSize)}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </ButtonContainer>
  )
};

export default Button;
