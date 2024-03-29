import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const TextLink = styled(Link)`
  font-family: 'Montserrat', serif;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  text-decoration-line: underline;
  color: ${props => props.theme.colors.text.link};
`;

export const RowWrapperLink = styled(Link)`
  text-decoration: none;
  width: 100%;
`;

