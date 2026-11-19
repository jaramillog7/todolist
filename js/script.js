
/* Elementos HTML que vamos a utilizar */

const formulario = document.getElementById("formulario-tarea");
const campoTarea = document.getElementById("nueva-tarea");
const listaTareas = document.getElementById("lista-tareas");
const claveAlmacenamiento = "todolist-tareas";

let tareasNecesitanMigracion = false;
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
            .map((tarea) => {
                if (typeof tarea.completada !== "boolean") {
                    tareasNecesitanMigracion = true;
                }

                return {
                    id: tarea.id,
                    texto: tarea.texto,
                    completada: tarea.completada === true
                };
            });
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
    if (tarea.completada) {
        descripcion.classList.add("todo__descripcion--completada");
    }

    const casillaCompletada = document.createElement("input");
    casillaCompletada.type = "checkbox";
    casillaCompletada.checked = tarea.completada;
    casillaCompletada.setAttribute("aria-label", `Marcar como completada: ${tarea.texto}`);
    casillaCompletada.addEventListener("change", function () {
        cambiarEstadoTarea(tarea.id, casillaCompletada.checked, descripcion);
    });

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("todo__eliminar");
    botonEliminar.addEventListener("click", function () {
        eliminarTarea(tarea.id, nuevaTarea);
    });

    nuevaTarea.appendChild(casillaCompletada);
    nuevaTarea.appendChild(descripcion);
    nuevaTarea.appendChild(botonEliminar);

    return nuevaTarea;
}

function cambiarEstadoTarea(id, completada, descripcion) {
    const tarea = tareas.find((elemento) => elemento.id === id);
    if (!tarea) {
        return;
    }

    tarea.completada = completada;
    descripcion.classList.toggle("todo__descripcion--completada", completada);
    guardarTareas();
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

    tareas.push({ id: crearId(), texto, completada: false });
    guardarTareas();
    listaTareas.appendChild(crearElementoTarea(tareas[tareas.length - 1]));

    // Limpiar el campo
    campoTarea.value = "";
    campoTarea.focus();
}

/* Evento del formulario */

formulario.addEventListener("submit", agregarTarea);
if (tareasNecesitanMigracion) {
    guardarTareas();
}
renderizarTareas();

function crearId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
