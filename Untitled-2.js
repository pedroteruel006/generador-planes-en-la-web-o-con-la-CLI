// server.js - ejemplo mínimo con Express
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Funciones utilitarias (ejemplo muy simple)
function bmrMifflin({ pesoKg, alturaCm, edad, sexo }) {
  if (sexo === 'male') return 10 * pesoKg + 6.25 * alturaCm - 5 * edad + 5;
  return 10 * pesoKg + 6.25 * alturaCm - 5 * edad - 161;
}
function tdee(user) {
  const factor = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  }[user.actividad || 'moderate'];
  return Math.round(bmrMifflin(user) * factor);
}

app.post('/api/generate-plan', (req, res) => {
  const { user, type } = req.body;
  if (!user) return res.status(400).json({ error: 'Falta user' });

  if (type === 'diet') {
    const baseTDEE = tdee(user);
    // Ejemplo: si objetivo es perder -> -20%
    const objetivo = user.objetivo || 'maintain';
    const ajuste = objetivo === 'lose' ? 0.8 : objetivo === 'gain' ? 1.1 : 1;
    const calorias = Math.round(baseTDEE * ajuste);
    const proteina_g = Math.round((user.pesoKg || 70) * 2); // 2g/kg
    const grasa_kcal = Math.round(calorias * 0.25);
    const grasa_g = Math.round(grasa_kcal / 9);
    const carbs_kcal = calorias - (proteina_g * 4) - (grasa_g * 9);
    const carbs_g = Math.round(carbs_kcal / 4);

    const plan = {
      type: 'diet',
      calorias,
      macros: { proteina_g, grasa_g, carbs_g },
      sample_day: [
        { meal: 'Desayuno', text: 'Avena + leche + fruta' },
        { meal: 'Comida', text: 'Pollo a la plancha, arroz, verduras' },
        { meal: 'Cena', text: 'Salmón, quinoa, ensalada' },
      ],
    };
    return res.json(plan);
  } else {
    // Plan de entrenamiento simple
    const nivel = user.nivel || 'intermediate';
    const dias = user.diasSemana || 3;
    const plan = {
      type: 'workout',
      nivel,
      diasSemana: dias,
      semana: [
        {
          dia: 1,
          ejercicios: [
            { name: 'Sentadilla', sets: 4, reps: 6 },
            { name: 'Press banca', sets: 4, reps: 6 },
            { name: 'Dominadas', sets: 3, reps: 6 },
          ],
        },
        // Generado según dias...
      ],
    };
    return res.json(plan);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
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