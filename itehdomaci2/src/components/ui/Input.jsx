import React from "react";

export default function Input({ label, error, ...props }) {
  return (
    <label className="input">
      <span>{label}</span>
      <input {...props} />
      {error ? <small className="error">{error}</small> : null}
    </label>
  );
}