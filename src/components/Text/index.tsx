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

export const TextSmall = styled(Text)`
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
`;

export const TextHint = styled(Text)`
  font-style: normal;
  font-weight: 100;
  font-size: 11px;
  color: ${props => props.theme.colors.text.title};
`;

export const TextUnderline = styled(TextRegular)`
  font-weight: 700;
  line-height: 20px;
  text-decoration-line: underline;
  color: ${props => props.theme.colors.text.link};
`;
