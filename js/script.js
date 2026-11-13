
/* Elementos HTML que vamos a utilizar */

const formulario = document.getElementById("formulario-tarea");
const campoTarea = document.getElementById("nueva-tarea");
const listaTareas = document.getElementById("lista-tareas");

/* Función para agregar una tarea */

function agregarTarea(evento) {
    evento.preventDefault();

    const texto = campoTarea.value.trim();

    if (texto === "") {
        return;
    }

    const nuevaTarea = document.createElement("li");

    nuevaTarea.textContent = texto;

    listaTareas.appendChild(nuevaTarea);

    campoTarea.value = "";
    campoTarea.focus();
}

/* Evento del formulario */

formulario.addEventListener("submit", agregarTarea);
