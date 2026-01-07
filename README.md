# Generador de Ejercicios y Dietas (MVP)

Este repo contiene un prototipo para una web que genera planes de entrenamiento y dietas.

Rápido inicio:
1. Backend (Node.js + Express)
   - `npm install`
   - `node server.js`
2. Frontend (React)
   - `cd frontend`
   - `npm install`
   - `npm start`

Endpoints:
- `POST /api/generate-plan` -> genera un plan (body: user, type)

Notas:
- Ajusta fórmulas de calorías y macros según requerimientos.
- Implementa autenticación y persistencia antes de publicar.
