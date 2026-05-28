import { createContext, useContext, useState } from 'react';

const CursoContext = createContext(null);

export function CursoProvider({ children }) {
  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  return (
    <CursoContext.Provider
      value={{
        cursoSelecionado,
        setCursoSelecionado,
      }}
    >
      {children}
    </CursoContext.Provider>
  );
}

export function useCurso() {
  const context = useContext(CursoContext);

  if (!context) {
    throw new Error('useCurso deve ser usado dentro de um CursoProvider.');
  }

  return context;
}