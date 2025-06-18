import React, { useState, useRef, useEffect } from 'react';
import './SortDropdown.css';

export default function SortDropdown({ options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="sort-dropdown">
      <button onClick={() => setOpen(!open)}>
        {options.find((o) => o.value === selected)?.label} ▼
      </button>
      {open && (
        <ul className="menu">
          {options.map((o) => (
            <li
              key={o.value}
              className={o.value === selected ? 'active' : ''}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}