import React from 'react';
import styles from './StyledImage.module.scss';

const StyledImage = ({
  src,
  alt,
  className,
  fluid = false,
  thumbnail = false,
  rounded = false,
  roundedCircle = false,
  ...rest
}) => {
  const classNames = [
    styles.styledImage,
    fluid && styles.imgFluid,
    thumbnail && styles.imgThumbnail,
    rounded && !roundedCircle && styles.rounded, // Apply .rounded only if not .roundedCircle
    roundedCircle && styles.roundedCircle,
    className,
  ].filter(Boolean).join(' ');

  return <img src={src} alt={alt} className={classNames} {...rest} />;
};

export default StyledImage;
