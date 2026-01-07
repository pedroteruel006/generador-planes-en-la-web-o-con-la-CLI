import React, { useState } from 'react';

export default function App() {
  const [user, setUser] = useState({
    pesoKg: 70, alturaCm: 175, edad: 30, sexo: 'male', actividad: 'moderate', objetivo: 'maintain', nivel: 'intermediate', diasSemana: 3
  });
  const [result, setResult] = useState(null);

  async function generar(type) {
    const res = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, type })
    });
    const json = await res.json();
    setResult(json);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Generador de planes</h1>
      <div>
        <label>Peso (kg)</label>
        <input type="number" value={user.pesoKg} onChange={e=>setUser({...user,pesoKg: +e.target.value})} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={()=>generar('diet')}>Generar Dieta</button>
        <button onClick={()=>generar('workout')} style={{ marginLeft: 8 }}>Generar Entreno</button>
      </div>
      <pre style={{ marginTop: 16 }}>{result ? JSON.stringify(result, null, 2) : 'Resultado aquí'}</pre>
    </div>
  );
}