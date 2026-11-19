import React from 'react';

const BrandLogo = ({ className = '' }) => (
  <img
    src="/finpulse-logo.svg"
    alt=""
    aria-hidden="true"
    className={className}
  />
);

export default BrandLogo;
