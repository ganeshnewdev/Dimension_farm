import React from 'react';

export default function Logo({ className = '', alt = '' }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt={alt}
      width="44"
      height="44"
      className={`rounded-full object-cover bg-white ${className}`}
    />
  );
}
