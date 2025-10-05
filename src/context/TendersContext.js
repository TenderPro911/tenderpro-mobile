// src/context/TendersContext.js
import React, { createContext, useState } from 'react';

export const TendersContext = createContext();

export function TendersProvider({ children }) {
  const [draft, setDraft] = useState({});

  function updateDraft(patch) {
    setDraft(prev => ({ ...prev, ...patch }));
  }

  function resetDraft() {
    setDraft({});
  }

  return (
    <TendersContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </TendersContext.Provider>
  );
}
