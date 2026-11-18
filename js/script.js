
/* Elementos HTML que vamos a utilizar */

const formulario = document.getElementById("formulario-tarea");
const campoTarea = document.getElementById("nueva-tarea");
const listaTareas = document.getElementById("lista-tareas");
const claveAlmacenamiento = "todolist-tareas";

let tareas = cargarTareas();

function cargarTareas() {
    try {
        const datosGuardados = localStorage.getItem(claveAlmacenamiento);
        const tareasGuardadas = datosGuardados ? JSON.parse(datosGuardados) : [];

        if (!Array.isArray(tareasGuardadas)) {
            return [];
        }

        return tareasGuardadas
            .filter((tarea) => tarea && typeof tarea.id === "string" && typeof tarea.texto === "string" && tarea.texto.trim() !== "")
            .map((tarea) => ({ id: tarea.id, texto: tarea.texto }));
    } catch (error) {
        return [];
    }
}

function guardarTareas() {
    try {
        localStorage.setItem(claveAlmacenamiento, JSON.stringify(tareas));
    } catch (error) {
        // La lista sigue disponible en memoria si el navegador bloquea el almacenamiento.
    }
}

function crearElementoTarea(tarea) {
    const nuevaTarea = document.createElement("li");

    const descripcion = document.createElement("span");
    descripcion.textContent = tarea.texto;

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("todo__eliminar");
    botonEliminar.addEventListener("click", function () {
        eliminarTarea(tarea.id, nuevaTarea);
    });

    nuevaTarea.appendChild(descripcion);
    nuevaTarea.appendChild(botonEliminar);

    return nuevaTarea;
}

function renderizarTareas() {
    listaTareas.replaceChildren();
    tareas.forEach((tarea) => {
        listaTareas.appendChild(crearElementoTarea(tarea));
    });
}

function eliminarTarea(id, elemento) {
    listaTareas.removeChild(elemento);
    const indice = tareas.findIndex((tarea) => tarea.id === id);
    if (indice !== -1) {
        tareas.splice(indice, 1);
    }
    guardarTareas();
}

/* Función para agregar una tarea */


function agregarTarea(evento) {
    evento.preventDefault();

    const texto = campoTarea.value.trim();

    if (texto === "") {
        return;
    }

    tareas.push({ id: crearId(), texto });
    guardarTareas();
    listaTareas.appendChild(crearElementoTarea(tareas[tareas.length - 1]));

    // Limpiar el campo
    campoTarea.value = "";
    campoTarea.focus();
}

/* Evento del formulario */

formulario.addEventListener("submit", agregarTarea);
renderizarTareas();

function crearId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
