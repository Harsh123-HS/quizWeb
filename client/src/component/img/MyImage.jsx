import React from 'react';

const MyImage = ({ src, alt, width = "100%", height = "auto", className = "" }) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={`rounded-2xl shadow-md transition-all duration-500 ease-in-out dark:brightness-130 dark:contrast-125 floating-image ${className}`}
    loading="lazy"
    decoding="async"
  />
);

export default MyImage;
