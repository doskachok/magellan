import styled from 'styled-components';
import { Row } from 'components/Containers';

export const GroupRowWrapper = styled(Row)`
  gap: 21px;
`;

export const GroupLogo = styled.img`
  display: inline-flex;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
`;

export const GroupName = styled.div`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  color: #000000;
`;

