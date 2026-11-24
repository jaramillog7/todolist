Mi aplicación To-Do List
1. Introducción
En esta actividad hice una lista de tareas usando HTML, CSS y JavaScript. Puedo agregar lo que tengo pendiente, editarlo, marcarlo como terminado o eliminarlo. La página también me muestra cuántas tareas tengo pendientes y completadas.
2. Herramientas utilizadas
- HTML: para organizar el título, el formulario y la lista.
- CSS: para los colores, las tarjetas, el centrado y el diseño en celular.
- JavaScript: para manejar los botones y actualizar las tareas.
- localStorage: para que las tareas sigan guardadas al actualizar la página.
- XAMPP: para abrir el proyecto desde mi computador con Apache.
3. Estructura del código
index.html
Aquí está la estructura de la página: el campo para escribir, el botón +, la lista y los contadores.
css/styles.css
Contiene el diseño. Usé Flexbox y ajustes para que la página se vea centrada y se adapte a diferentes pantallas.
js/script.js
Aquí programé las acciones de las tareas. Con los eventos de JavaScript puedo agregar, editar, completar o eliminar sin recargar la página.
4. ¿Cómo funciona?
Agregar y modificar tareas
Cuando escribo una tarea y presiono +, el código revisa que no esté vacía y la agrega. También puedo cambiar su texto, marcarla como completada o borrarla.
Contadores y almacenamiento
actualizarContadores() calcula las tareas pendientes y completadas. guardarTareas() y cargarTareas() usan localStorage para conservarlas, incluso si actualizo la página.
5. ¿Cómo ejecutarlo?
Inicio Apache en XAMPP y abro esta dirección:
http://localhost/Todolist/practica-dom/
6. ¿Qué aprendí?
Con este trabajo practiqué la manipulación del DOM, el uso de eventos y cómo conectar HTML, CSS y JavaScript para que una página sea interactiva.