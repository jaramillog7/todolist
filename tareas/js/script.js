
/* Elementos HTML que vamos a utilizar */

const formulario = document.getElementById("formulario-tarea");
const campoTarea = document.getElementById("nueva-tarea");
const listaTareas = document.getElementById("lista-tareas");
const resumenTareas = document.getElementById("resumen-tareas");
const mensajeError = document.createElement("p");
mensajeError.setAttribute("role", "alert");
mensajeError.hidden = true;
formulario.after(mensajeError);
let tareas = [];
let operacionPendiente = false;

async function solicitarTareas(ruta = "", metodo = "GET", datos) {
    const response = await fetch(`/api/tareas${ruta}`, {
        method: metodo,
        ...(datos === undefined ? {} : {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
    });
    if (!response.ok) {
        throw new Error("No se pudo completar la solicitud.");
    }
    return response.status === 204 ? null : response.json();
}

async function ejecutarOperacion(accion) {
    if (operacionPendiente) return;
    operacionPendiente = true;
    mensajeError.hidden = true;
    const controles = [...document.querySelectorAll("button, input")];
    controles.forEach((control) => { control.disabled = true; });
    try {
        await accion();
    } catch (error) {
        mensajeError.textContent = "No se pudo comunicar con el servidor. Los cambios no se confirmaron. Intenta de nuevo.";
        mensajeError.hidden = false;
    } finally {
        controles.forEach((control) => { control.disabled = false; });
        operacionPendiente = false;
    }
}

async function cargarTareas() {
    await ejecutarOperacion(async () => {
        const recibidas = await solicitarTareas();
        tareas = recibidas;
        renderizarTareas();
    });
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
        const completada = casillaCompletada.checked;
        casillaCompletada.checked = tarea.completada;
        cambiarEstadoTarea(tarea.id, completada);
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
    if (texto === "" || texto.length > 100) {
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

    ejecutarOperacion(async () => {
        const actualizada = await solicitarTareas(`/${encodeURIComponent(id)}`, "PUT", { texto, completada: tarea.completada });
        Object.assign(tarea, actualizada);
        renderizarTareas();
    });
}

function cambiarEstadoTarea(id, completada) {
    const tarea = tareas.find((elemento) => elemento.id === id);
    if (!tarea) return;
    ejecutarOperacion(async () => {
        const actualizada = await solicitarTareas(`/${encodeURIComponent(id)}`, "PUT", { texto: tarea.texto, completada });
        Object.assign(tarea, actualizada);
        renderizarTareas();
    });
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

function eliminarTarea(id) {
    ejecutarOperacion(async () => {
        await solicitarTareas(`/${encodeURIComponent(id)}`, "DELETE");
        tareas = tareas.filter((tarea) => tarea.id !== id);
        renderizarTareas();
    });
}

function agregarTarea(evento) {
    evento.preventDefault();
    const texto = campoTarea.value.trim();
    if (texto === "" || texto.length > 100) return;
    ejecutarOperacion(async () => {
        const nuevaTarea = await solicitarTareas("", "POST", { texto });
        tareas.push(nuevaTarea);
        renderizarTareas();
        campoTarea.value = "";
    }).then(() => campoTarea.focus());
}

formulario.addEventListener("submit", agregarTarea);
cargarTareas();
