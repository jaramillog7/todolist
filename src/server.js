const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Cada tarea tendrá id, texto y completada. Los datos viven en memoria.
const tareas = [];

app.get('/api/tareas', (req, res) => {
    res.status(200).json(tareas);
});

app.get('/', (req, res) => {
    res.redirect('/tareas/');
});

app.use('/tareas', express.static(path.join(__dirname, '..', 'tareas')));
app.use('/contactos', express.static(path.join(__dirname, '..', 'contactos')));

app.listen(PORT, () => {
    console.log(`Servidor disponible en http://localhost:${PORT}`);
});
