const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.redirect('/tareas/');
});

app.use('/tareas', express.static(path.join(__dirname, '..', 'tareas')));
app.use('/contactos', express.static(path.join(__dirname, '..', 'contactos')));

app.listen(PORT, () => {
    console.log(`Servidor disponible en http://localhost:${PORT}`);
});
