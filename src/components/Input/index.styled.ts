import styled from 'styled-components';

export const InputStyled = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  height: 48px;
  width: 100%;
  padding: 11px 18px 15px;

  font-weight: 500;
  font-size: 18px;
  color: #000000;
  
  ::placeholder {
    font-weight: 300;
    color: #000000;
  }
`;
