import React from "react";
import Button from "./ui/Button";

export default function SearchBar({
  query, onQuery,
  status, onStatus,
  onReset,
  extra
}) {
  return (
    <div className="searchbar">
      <input
        placeholder="Pretraga (naziv, dimenzije...)"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
      />
      <select value={status} onChange={(e) => onStatus(e.target.value)}>
        <option value="">Sve statusi</option>
        <option value="pending">pending</option>
        <option value="shipped">shipped</option>
        <option value="delivered">delivered</option>
      </select>
      <Button onClick={onReset} variant="ghost">Reset</Button>
      {extra}
    </div>
  );
}