const express = require('express');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
const PORT = 3000;

app.use(express.json());

// Cada tarea tendrá id, texto y completada. Los datos viven en memoria.
const tareas = [];

// Campos de contacto: id, firstName, lastName, phone, city, address y gender.
const contactos = [];

app.get('/api/contactos', (req, res) => {
    res.status(200).json(contactos);
});

function validarContacto(datos) {
    const { firstName, lastName, phone, city, address, gender } = datos ?? {};
    const campos = [firstName, lastName, phone, city, address, gender];

    if (campos.some((campo) => typeof campo !== 'string' || campo.trim() === '')) {
        return 'Todos los campos son obligatorios y deben ser texto.';
    }

    if (!['Female', 'Male'].includes(gender.trim())) {
        return 'El género debe ser Female o Male.';
    }

    return null;
}

function prepararContacto(datos) {
    return {
        firstName: datos.firstName.trim(),
        lastName: datos.lastName.trim(),
        phone: datos.phone.trim(),
        city: datos.city.trim(),
        address: datos.address.trim(),
        gender: datos.gender.trim()
    };
}

app.post('/api/contactos', (req, res) => {
    const error = validarContacto(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    const nuevoContacto = { id: randomUUID(), ...prepararContacto(req.body) };
    contactos.push(nuevoContacto);
    res.status(201).json(nuevoContacto);
});

app.put('/api/contactos/:id', (req, res) => {
    const contacto = contactos.find((contacto) => contacto.id === req.params.id);
    if (!contacto) {
        return res.status(404).json({ error: 'Contacto no encontrado.' });
    }

    const error = validarContacto(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    Object.assign(contacto, prepararContacto(req.body));
    res.status(200).json(contacto);
});

app.delete('/api/contactos/:id', (req, res) => {
    const indice = contactos.findIndex((contacto) => contacto.id === req.params.id);

    if (indice === -1) {
        return res.status(404).json({ error: 'Contacto no encontrado.' });
    }

    contactos.splice(indice, 1);
    res.status(204).send();
});

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

app.delete('/api/tareas/:id', (req, res) => {
    const indice = tareas.findIndex((tarea) => tarea.id === req.params.id);

    if (indice === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    tareas.splice(indice, 1);
    res.status(204).send();
});

app.get('/', (req, res) => {
    res.redirect('/tareas/');
});

app.use('/tareas', express.static(path.join(__dirname, '..', 'tareas')));
app.use('/contactos', express.static(path.join(__dirname, '..', 'contactos')));

app.listen(PORT, () => {
    console.log(`Servidor disponible en http://localhost:${PORT}`);
});
