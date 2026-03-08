 
import React from "react";

export default function Button({
  type = "button",                 
  variant,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn ${variant ? variant : ""} ${className}`}
      {...props}
    />
  );
}
