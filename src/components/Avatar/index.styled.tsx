import styled, { css } from 'styled-components';
import { Row } from '../Containers';

export interface IAvatarProps {
  rounded: boolean;
  framed: boolean;
  size: AvatarSize
};

export enum AvatarSize {
  Small = 0,
  Medium = 1,
  Large = 2,
}

export const ImageStyled = styled(Row)<IAvatarProps>`
  ${props => props.rounded && css`border-radius: 50%;`}
  ${props => props.framed && css`border: solid 5px white;`}

  & img {
    height: ${props => sizeTranslator(props.size)};
    width: ${props => sizeTranslator(props.size)};
    object-fit: cover;
    ${props => props.rounded && css`border-radius: 50%;`};
  }
`;

const largeAvatarSize: string = '14rem';
const mediumAvatarSize: string = '7rem';
const smallAvatarSize: string = '3rem';

function sizeTranslator(size: AvatarSize): string {
  switch(size) {
    case AvatarSize.Large: return largeAvatarSize;
    case AvatarSize.Medium: return mediumAvatarSize;
    case AvatarSize.Small:
    default: return smallAvatarSize;
  }
}