
/* Elementos HTML que vamos a utilizar */

const formulario = document.getElementById("formulario-tarea");
const campoTarea = document.getElementById("nueva-tarea");
const listaTareas = document.getElementById("lista-tareas");
const resumenTareas = document.getElementById("resumen-tareas");
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
    descripcion.classList.add("todo__descripcion");
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

    const botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.textContent = "Editar";
    botonEditar.classList.add("todo__editar");
    botonEditar.setAttribute("aria-label", `Editar tarea: ${tarea.texto}`);
    botonEditar.addEventListener("click", function () {
        iniciarEdicion(tarea.id, nuevaTarea);
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
    nuevaTarea.appendChild(botonEditar);
    nuevaTarea.appendChild(botonEliminar);

    return nuevaTarea;
}

function iniciarEdicion(id, elemento) {
    const tarea = tareas.find((elementoTarea) => elementoTarea.id === id);
    if (!tarea) {
        return;
    }

    const campoEdicion = document.createElement("input");
    campoEdicion.type = "text";
    campoEdicion.value = tarea.texto;
    campoEdicion.maxLength = 100;
    campoEdicion.classList.add("todo__campo-edicion");
    campoEdicion.setAttribute("aria-label", `Editar tarea: ${tarea.texto}`);

    const descripcion = elemento.querySelector(".todo__descripcion");
    descripcion.replaceWith(campoEdicion);

    const botonEditar = elemento.querySelector(".todo__editar");
    const botonGuardar = document.createElement("button");
    botonGuardar.type = "button";
    botonGuardar.textContent = "Guardar";
    botonGuardar.classList.add("todo__editar");
    botonGuardar.setAttribute("aria-label", `Guardar tarea: ${tarea.texto}`);
    botonGuardar.addEventListener("click", () => guardarEdicion(id, campoEdicion));
    botonEditar.replaceWith(botonGuardar);

    const botonCancelar = document.createElement("button");
    botonCancelar.type = "button";
    botonCancelar.textContent = "Cancelar";
    botonCancelar.classList.add("todo__cancelar");
    botonCancelar.addEventListener("click", () => renderizarTareas());
    botonGuardar.after(botonCancelar);

    campoEdicion.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            guardarEdicion(id, campoEdicion);
        } else if (evento.key === "Escape") {
            renderizarTareas();
        }
    });

    campoEdicion.focus();
    campoEdicion.select();
}

function guardarEdicion(id, campoEdicion) {
    const texto = campoEdicion.value.trim();
    if (texto === "") {
        campoEdicion.setCustomValidity("La tarea no puede quedar vacía.");
        campoEdicion.reportValidity();
        campoEdicion.setCustomValidity("");
        campoEdicion.focus();
        return;
    }

    const tarea = tareas.find((elemento) => elemento.id === id);
    if (!tarea) {
        return;
    }

    tarea.texto = texto;
    guardarTareas();
    renderizarTareas();
}

function cambiarEstadoTarea(id, completada, descripcion) {
    const tarea = tareas.find((elemento) => elemento.id === id);
    if (!tarea) {
        return;
    }

    tarea.completada = completada;
    descripcion.classList.toggle("todo__descripcion--completada", completada);
    guardarTareas();
    actualizarContadores();
}

function renderizarTareas() {
    listaTareas.replaceChildren();
    tareas.forEach((tarea) => {
        listaTareas.appendChild(crearElementoTarea(tarea));
    });
    actualizarContadores();
}

function actualizarContadores() {
    const completadas = tareas.filter((tarea) => tarea.completada).length;
    const pendientes = tareas.length - completadas;
    resumenTareas.textContent = `Pendientes: ${pendientes} | Completadas: ${completadas}`;
}

function eliminarTarea(id, elemento) {
    listaTareas.removeChild(elemento);
    const indice = tareas.findIndex((tarea) => tarea.id === id);
    if (indice !== -1) {
        tareas.splice(indice, 1);
    }
    guardarTareas();
    actualizarContadores();
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
    actualizarContadores();

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
