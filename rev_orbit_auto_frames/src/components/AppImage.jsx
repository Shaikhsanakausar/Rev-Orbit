import React from 'react';


function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {
  const fallback = "/assets/images/no_image.png";
  return (
    <img
      src={src || fallback}
      alt={alt}
      className={className}
      onError={e => {
        if (e.target.src !== window.location.origin + fallback) {
          console.warn('Image not found:', src);
          e.target.src = fallback;
        }
      }}
      {...props}
    />
  );
}

export default Image;
