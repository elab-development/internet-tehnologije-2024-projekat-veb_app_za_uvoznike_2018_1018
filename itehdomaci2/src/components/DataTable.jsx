import React from "react";

export default function DataTable({ columns, rows, emptyText = "Nema podataka" }) {
  return (
    <div className="table-wrap">
      <table className="tbl">
        <thead>
          <tr>{columns.map((c) => <th key={c.key}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} className="empty">{emptyText}</td></tr>
          )}
          {rows.map((r) => (
            <tr key={r.id ?? JSON.stringify(r)}>
              {columns.map((c) => (
                <td key={c.key}>
                  {typeof c.render === "function" ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}