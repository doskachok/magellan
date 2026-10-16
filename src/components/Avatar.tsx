import { useState } from 'react';
import styled from 'styled-components';

import { getInitials } from 'lib/format';

const PALETTE = ['#1E7F57', '#2B6CB0', '#8A4FBF', '#B7572B', '#2F7F86', '#9B3D63'];

const colorFor = (seed: string) => {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length]!;
};

const Circle = styled.span<{ $size: number; $color: string }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ $color }) => $color};
  color: #fff;
  font-size: ${({ $size }) => Math.round($size * 0.38)}px;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  user-select: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
}

/** Shows the image when it loads, otherwise coloured initials derived from `name`. */
export const Avatar = ({ name, src, size = 40 }: AvatarProps) => {
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = src && failedSrc !== src;

  return (
    <Circle $size={size} $color={colorFor(name)} aria-hidden>
      {showImage ? <img src={src} alt="" onError={() => setFailedSrc(src)} /> : getInitials(name) || '?'}
    </Circle>
  );
};
