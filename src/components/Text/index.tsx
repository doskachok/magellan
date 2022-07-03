import styled from 'styled-components';

export const Text = styled.p`
  margin: 0;
  font-family: 'Montserrat';
  color: ${props => props.theme.colors.text.primary};
`;

export const TextHeader = styled(Text)`
  font-weight: 700;
  font-size: 23px;
  color: ${props => props.theme.colors.text.secondary};
`;

export const TextRegular = styled(Text)`
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
`;
