import {InputStyled} from './index.styled';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Input = ({value, onChange, placeholder = ''}: Props) => {
  return (
    <InputStyled
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    />
  );
};

export default Input;
