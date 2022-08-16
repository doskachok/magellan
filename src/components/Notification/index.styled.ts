import styled from 'styled-components';
import { Text } from '../Text';

export const NotificationWrapper = styled.div`
  text-align: center;
  height: 40px;
  width: 100%;
  line-height: 40px;
  animation: showUp 5s ease-in-out;
  position: absolute;
  top: 60px;
  opacity: 0;

  @keyframes showUp {
    0% {
      height: 0;
      opacity: 0;
    }
    30%,
    80% {
      height: 40px;
      opacity: 1;
    }
    100% {
      height: 0;
      opacity: 0;
    }
  }
`;

export const NotificationText = styled(Text)`
  color: ${(props) => props.theme.colors.text.notification.success};
`;
