import styled, { css } from 'styled-components';

interface TextProps {
  reversedColor?: boolean;
}

export const Text = styled.p<TextProps>`
  margin: 0;
  font-family: 'Montserrat';
  color: ${props => props.theme.colors.text.primary};

  ${props => props.reversedColor && css`
    color: ${props => props.theme.colors.text.secondary};
  `};
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

export const TextUnderline = styled(TextRegular)`
  font-weight: 700;
  line-height: 20px;
  text-decoration-line: underline;
  color: ${props => props.theme.colors.text.link};
`;
