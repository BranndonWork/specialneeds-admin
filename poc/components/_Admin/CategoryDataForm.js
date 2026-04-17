import { useState, useRef } from "react";

function normalizeToArray(val) {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  return val.split(",").map((s) => s.trim()).filter(Boolean);
}

function TagInput({ value, options, placeholder, onChange }) {
  const tags = normalizeToArray(value);
  const [inputVal, setInputVal] = useState("");
  const inputId = useRef(`tag-input-${Math.random().toString(36).slice(2)}`).current;
  const listId = useRef(`tag-list-${Math.random().toString(36).slice(2)}`).current;

  const isQuoted = (s) => s.startsWith('"') && s.endsWith('"');

  const stripQuotes = (s) => isQuoted(s) ? s.slice(1, -1).trim() : s;

  const addTag = (tag) => {
    const trimmed = stripQuotes(tag.trim());
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputVal("");
  };

  const removeTag = (index) => {
    const next = tags.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === "Backspace" && !inputVal && tags.length) {
      removeTag(tags.length - 1);
    }
  };

  const handleChange = (e) => {
    const newVal = e.target.value;
    // Auto-commit when user selects an exact match from the datalist dropdown
    if (options?.includes(newVal)) {
      addTag(newVal);
      return;
    }
    // Split on ", " only when not in a quoted phrase
    if (!newVal.startsWith('"') && newVal.includes(", ")) {
      const parts = newVal.split(", ");
      const toAdd = parts.slice(0, -1).map((p) => p.trim()).filter((p) => p && !tags.includes(p));
      if (toAdd.length > 0) {
        onChange([...tags, ...toAdd]);
      }
      setInputVal(parts[parts.length - 1]);
    } else {
      setInputVal(newVal);
    }
  };

  return (
    <div>
      <input
        id={inputId}
        list={listId}
        value={inputVal}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (inputVal) addTag(inputVal); }}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "8px 12px",
          fontSize: "13px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
          color: "#221638",
          boxSizing: "border-box",
          outline: "none",
        }}
      />
      {options?.length > 0 && (
        <datalist id={listId}>
          {options.map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>
      )}
      {tags.length > 0 && (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginTop: "8px",
        }}>
          {tags.map((tag, i) => (
            <span key={i} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "#e0f0fa",
              color: "#0281c4",
              borderRadius: "4px",
              padding: "3px 8px",
              fontSize: "12px",
              fontWeight: 500,
            }}>
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                style={{
                  border: "none",
                  background: "none",
                  color: "#0281c4",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "14px",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryField({ sectionKey, fieldKey, field, onChange }) {
  const { label, description, attributes } = field;
  const { type, value, options, placeholder, additionalProps } = attributes;
  // Default multiple=true for autocomplete fields, matching API behavior (explicit false required to disable)
  const isMultiple = type === "autocomplete"
    ? additionalProps?.multiple !== false
    : additionalProps?.multiple === true;

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#555",
    marginBottom: "4px",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    fontSize: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
    color: "#221638",
    boxSizing: "border-box",
  };

  const handleChange = (newValue) => onChange(sectionKey, fieldKey, newValue);

  let control;

  if (type === "checkbox") {
    control = (
      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#221638", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => handleChange(e.target.checked)}
          style={{ width: "16px", height: "16px", cursor: "pointer" }}
        />
        {label}
      </label>
    );
    return (
      <div style={{ marginBottom: "16px" }}>
        {control}
        {description && <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#999" }}>{description}</p>}
      </div>
    );
  }

  if (type === "autocomplete" && isMultiple) {
    control = (
      <TagInput
        value={value}
        options={options}
        placeholder={placeholder}
        onChange={handleChange}
      />
    );
  } else if (type === "autocomplete") {
    const singleId = `datalist-${sectionKey}-${fieldKey}`;
    control = (
      <>
        <input
          list={singleId}
          type="text"
          value={value ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
        />
        {options?.length > 0 && (
          <datalist id={singleId}>
            {options.map((opt) => <option key={opt} value={opt} />)}
          </datalist>
        )}
      </>
    );
  } else if (type === "number" || type === "float") {
    control = (
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    );
  } else {
    // text, email, tel, url, date
    control = (
      <input
        type={type ?? "text"}
        value={value ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    );
  }

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      {control}
      {description && <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#999" }}>{description}</p>}
    </div>
  );
}

export default function CategoryDataForm({ categoryData, onChange }) {
  const [collapsed, setCollapsed] = useState({});

  if (!categoryData || Object.keys(categoryData).length === 0) {
    return <p style={{ color: "#999", fontSize: "13px" }}>No category-specific fields.</p>;
  }

  const toggleSection = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {Object.entries(categoryData).map(([sectionKey, section]) => {
        const isCollapsed = collapsed[sectionKey];
        const fields = section.fields ?? {};
        return (
          <div key={sectionKey} style={{ border: "1px solid #e5e7eb", borderRadius: "6px", overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => toggleSection(sectionKey)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#f9fafb",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#221638" }}>{section.label}</span>
              <span style={{ fontSize: "12px", color: "#888" }}>{isCollapsed ? "▼" : "▲"}</span>
            </button>
            {!isCollapsed && (
              <div style={{ padding: "16px" }}>
                {section.description && (
                  <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#888" }}>{section.description}</p>
                )}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(max(calc(33.33% - 16px), 300px), 1fr))",
                  gap: "0 24px",
                }}>
                  {Object.entries(fields).map(([fieldKey, field]) => (
                    <CategoryField
                      key={fieldKey}
                      sectionKey={sectionKey}
                      fieldKey={fieldKey}
                      field={field}
                      onChange={onChange}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
