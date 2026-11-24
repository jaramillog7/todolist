# Taller DOM + API con Node.js y Express

Hecho por Sayi Ramirez Y Giuliano Jaramillo

## ¿De qué trata el proyecto?

Para este taller junté dos páginas que ya había trabajado: una lista de tareas y una lista de contactos. La idea era que no se quedaran solo funcionando con JavaScript en el navegador, sino conectarlas a una API hecha con Node.js y Express.

En la lista de tareas puedo agregar, editar, marcar como completadas y eliminar tareas. También aparecen los contadores de pendientes y completadas. En la de contactos puedo registrar personas con sus datos, verlas, editarlas y eliminarlas.

## ¿Cómo lo hice?

Usé **HTML** para la estructura de las páginas, **CSS** para el diseño y **JavaScript** para manejar los formularios y actualizar la información en pantalla. Después configuré un servidor con **Node.js y Express**.

Para comunicar las páginas con el servidor utilicé `fetch()`. La API tiene estos métodos para tareas y contactos:

- **GET:** consultar los registros.
- **POST:** agregar uno nuevo.
- **PUT:** actualizar uno existente.
- **DELETE:** eliminarlo.

## ¿Cómo se ejecuta?

Desde la carpeta principal del proyecto, abro la terminal y escribo:

```powershell
npm.cmd install
npm.cmd run dev
```

Con el servidor encendido, puedo entrar a:

- **Tareas:** [http://localhost:3000/tareas/](http://localhost:3000/tareas/)
- **Contactos:** [http://localhost:3000/contactos/](http://localhost:3000/contactos/)

Por ahora, los datos de la API se guardan en arreglos del servidor. **Si reinicio Node.js, se pierden los registros**, porque todavía no hay una base de datos permanente.

## ¿Qué aprendí y cómo utilicé la IA?

Con este trabajo practiqué la manipulación del DOM, los eventos de JavaScript y la diferencia entre una página web y una API. También entendí mejor cómo funcionan las peticiones HTTP y las respuestas del servidor.

Utilicé **ChatGPT como apoyo** para revisar código y hacer pruebas. Fui trabajando cada cambio por separado y guardando los avances con commits en GitHub.
