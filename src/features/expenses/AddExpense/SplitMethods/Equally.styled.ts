import styled from "styled-components";
import { TextRegular } from "components";

export const CurrencyText = styled(TextRegular)`
  font-weight: bold;
  text-align: right;
  color: ${props => props.theme.colors.text.secondary};
`;