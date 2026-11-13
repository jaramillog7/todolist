
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

    // Crear el elemento de la lista
    const nuevaTarea = document.createElement("li");

    // Crear el texto de la tarea
    const descripcion = document.createElement("span");
    descripcion.textContent = texto;

    // Crear el botón para eliminar
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("todo__eliminar");

    // Escuchar el clic del botón
    botonEliminar.addEventListener("click", function () {
        listaTareas.removeChild(nuevaTarea);
    });

    // Agregar el texto y el botón a la tarea
    nuevaTarea.appendChild(descripcion);
    nuevaTarea.appendChild(botonEliminar);

    // Mostrar la tarea en la lista
    listaTareas.appendChild(nuevaTarea);

    // Limpiar el campo
    campoTarea.value = "";
    campoTarea.focus();
}

/* Evento del formulario */

formulario.addEventListener("submit", agregarTarea);
