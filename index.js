// 1. Use require instead of import
const express = require('express');
const morgan = require('morgan');
//const _ = require('lodash');

// Internal modules
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;


// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Cargar preguntas desde JSON. En esta variable dispones siempre de todas las preguntas de la "base de datos"
const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf-8'));

// Endpoint para obtener una pregunta aleatoria (con filtro por categoría)
app.get('/api/question', (req, res) => {
  // 0. Obtenemos el parámetro 'category'
  const categoryFilter = req.query.category;

  // 1. Preparamos el array de preguntas. Por defecto son todas.
  let filteredQuestions = questions;

  // 2. Reducimos el array solo a las coincidentes
  if (categoryFilter) {
    filteredQuestions = questions.filter(q => q.category === categoryFilter);
  }

  // 3. Manejo de error
  if (filteredQuestions.length === 0) {
    return res.status(404).json({ message: "No se encontraron preguntas para esta categoría" });
  }

  // 4. Elegimos una pregunta aleatoria del array
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  const randomQuestion = filteredQuestions[randomIndex];

  res.send(randomQuestion);
});

// Endpoint para obtener categorías únicas
app.get('/api/categories', (req, res) => {
  // 1. Usamos .map para crear un nuevo array que solo contenga los strings de categorías
  const allCategories = questions.map(q => q.category);

  // 2. Usamos new Set() para eliminar duplicados automáticamente
  const uniqueCategories = [...new Set(allCategories)];

  // 3. Devolvemos el array limpio
  res.send(uniqueCategories);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Trivia escuchando en http://localhost:${PORT}`);
});
