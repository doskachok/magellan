import {
  useCallback,
  memo,
  FocusEvent,
  MouseEvent,
  SelectHTMLAttributes,
  ChangeEvent,
} from 'react';
import { SelectLabel, SelectStyled, Wrapper } from './index.styled';
import { ReactComponent as AngleDownSVG } from '../../assets/images/angle-down.svg';
import { useState } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  value: string;
  name: string;
  options: { title: string, value: string }[];
  onValueChanged: (name: string, value: string) => void;
  reversedTheme?: boolean;
}

const Select =
  ({
    value,
    name,
    options = [],
    onValueChanged,
    reversedTheme = false,
    onClick,
    onBlur,
    ...rest
  }: Props) => {
    const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
      onValueChanged(name, event.target.value);
    }, [onValueChanged, name]);

    const [isOpened, setIsOpened] = useState(false);

    const handleClick = useCallback((event: MouseEvent<HTMLSelectElement>) => {
      onClick && onClick(event);

      setIsOpened(!isOpened);
    }, [isOpened, onClick]);

    const handleBlur = useCallback((event: FocusEvent<HTMLSelectElement>) => {
      onBlur && onBlur(event);

      setIsOpened(false);
    }, [onBlur]);

    return (
      <Wrapper fullWidth>
        <SelectLabel reversedTheme={reversedTheme} isOpened={isOpened}>
          <span>{options.find(v => v.value === value)?.title}</span>
          <SelectStyled
            name={name}
            value={value}
            onChange={handleChange}
            reversedTheme={reversedTheme}
            onBlur={handleBlur}
            onClick={handleClick}
            {...rest}>
            {options.map(o => <option key={o.value} value={o.value}>{o.title}</option>)}
          </SelectStyled>

          <AngleDownSVG />
        </SelectLabel>
      </Wrapper>
    );
  };

export default memo(Select);
