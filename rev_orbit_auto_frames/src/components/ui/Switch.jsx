import React from "react";

export default function Switch({ checked, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ display: "none" }}
      />
      <span
        style={{
          width: 40,
          height: 20,
          background: checked ? "#4ade80" : "#d1d5db",
          borderRadius: 20,
          position: "relative",
          transition: "background 0.2s",
          marginRight: 8,
          display: "inline-block"
        }}
      >
        <span
          style={{
            position: "absolute",
            left: checked ? 22 : 2,
            top: 2,
            width: 16,
            height: 16,
            background: "#fff",
            borderRadius: "50%",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            transition: "left 0.2s"
          }}
        />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
