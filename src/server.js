const express = require('express');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
const PORT = 3000;

app.use(express.json());

// Cada tarea tendrá id, texto y completada. Los datos viven en memoria.
const tareas = [];

app.get('/api/tareas', (req, res) => {
    res.status(200).json(tareas);
});

app.post('/api/tareas', (req, res) => {
    const texto = req.body?.texto;

    if (typeof texto !== 'string' || texto.trim() === '' || texto.trim().length > 100) {
        return res.status(400).json({ error: 'El texto debe tener entre 1 y 100 caracteres.' });
    }

    const nuevaTarea = {
        id: randomUUID(),
        texto: texto.trim(),
        completada: false
    };

    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

app.put('/api/tareas/:id', (req, res) => {
    const tarea = tareas.find((tarea) => tarea.id === req.params.id);

    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    const texto = req.body?.texto;
    const completada = req.body?.completada;

    if (typeof texto !== 'string' || texto.trim() === '' || texto.trim().length > 100 || typeof completada !== 'boolean') {
        return res.status(400).json({ error: 'Envía texto de 1 a 100 caracteres y completada como booleano.' });
    }

    tarea.texto = texto.trim();
    tarea.completada = completada;
    res.status(200).json(tarea);
});

app.get('/', (req, res) => {
    res.redirect('/tareas/');
});

app.use('/tareas', express.static(path.join(__dirname, '..', 'tareas')));
app.use('/contactos', express.static(path.join(__dirname, '..', 'contactos')));

app.listen(PORT, () => {
    console.log(`Servidor disponible en http://localhost:${PORT}`);
});
