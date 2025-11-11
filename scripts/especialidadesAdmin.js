import { especialidadesIniciales } from '../config/especialidades.js';

if (!localStorage.getItem('especialidades')) {
  localStorage.setItem(
    'especialidades',
    JSON.stringify(especialidadesIniciales)
  );
}

let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
let modoEdicion = false;

function generarId() {
  return Math.floor(100000 + Math.random() * 900000);
}

function guardarEnLocalStorage() {
  localStorage.setItem('especialidades', JSON.stringify(especialidades));
}

function renderizarEspecialidades() {
  const tablaBody = document.querySelector('#tablaEspecialidades tbody');
  if (!tablaBody) return;

  const filasHTML = especialidades
    .map(
      (especialidad) => `
        <tr data-id="${especialidad.id}">
            <td>${especialidad.id}</td>
            <td>${especialidad.nombre}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2 btn-modificar" data-id="${especialidad.id}">
                    Modificar
                </button>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${especialidad.id}">
                    Eliminar
                </button>
            </td>
        </tr>
    `
    )
    .join('');

  tablaBody.innerHTML = filasHTML;

  document.querySelectorAll('.btn-modificar').forEach((boton) => {
    boton.addEventListener('click', function () {
      const id = parseInt(this.getAttribute('data-id'));
      cargarEspecialidadParaEdicion(id);
    });
  });

  document.querySelectorAll('.btn-eliminar').forEach((boton) => {
    boton.addEventListener('click', function () {
      const id = parseInt(this.getAttribute('data-id'));
      eliminarEspecialidad(id);
    });
  });
}

function altaEspecialidad(event) {
  event.preventDefault();

  const inputNombre = document.getElementById('nombre');
  const especialidadIdInput = document.getElementById('especialidadId');

  const datosEspecialidad = {
    nombre: inputNombre.value.trim(),
  };

  if (!datosEspecialidad.nombre) {
    alert('Complete el campo requerido (Nombre)');
    return;
  }

  if (modoEdicion) {
    const idAActualizar = parseInt(especialidadIdInput.value);
    const indice = especialidades.findIndex((e) => e.id === idAActualizar);

    if (indice !== -1) {
      especialidades[indice] = { id: idAActualizar, ...datosEspecialidad };
      alert(`Especialidad ID ${idAActualizar} modificada.`);
      guardarEnLocalStorage();
      renderizarEspecialidades();
      restablecerFormulario();
    }
  } else {
    const nuevaEspecialidad = { id: generarId(), ...datosEspecialidad };
    especialidades.push(nuevaEspecialidad);
    alert(`Especialidad ${datosEspecialidad.nombre} registrada.`);
    guardarEnLocalStorage();
    renderizarEspecialidades();
    restablecerFormulario();
  }
}

function cargarEspecialidadParaEdicion(id) {
  const especialidad = especialidades.find((e) => e.id === id);
  if (especialidad) {
    const inputNombre = document.getElementById('nombre');
    const especialidadIdInput = document.getElementById('especialidadId');
    const submitBtn = document.getElementById('submitBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');

    inputNombre.value = especialidad.nombre;

    especialidadIdInput.value = especialidad.id;
    modoEdicion = true;
    submitBtn.textContent = 'Guardar Cambios';
    cancelarBtn.style.display = 'inline-block';
  }
}

function restablecerFormulario() {
  const formEspecialidad = document.getElementById('altaEspecialidadForm');
  const especialidadIdInput = document.getElementById('especialidadId');
  const submitBtn = document.getElementById('submitBtn');
  const cancelarBtn = document.getElementById('cancelarBtn');

  formEspecialidad.reset();
  especialidadIdInput.value = '';
  modoEdicion = false;
  submitBtn.textContent = 'Registrar Especialidad';
  cancelarBtn.style.display = 'none';
}

function eliminarEspecialidad(id) {
  if (
    confirm(
      `¿Estás seguro de que quieres eliminar la especialidad con ID ${id}?`
    )
  ) {
    especialidades = especialidades.filter(
      (especialidad) => especialidad.id !== id
    );
    alert('Especialidad eliminada.');

    const especialidadIdInput = document.getElementById('especialidadId');
    if (parseInt(especialidadIdInput.value) === id) {
      restablecerFormulario();
    }

    guardarEnLocalStorage();
    renderizarEspecialidades();
  }
}

function init() {
  const formEspecialidad = document.getElementById('altaEspecialidadForm');
  const cancelarBtn = document.getElementById('cancelarBtn');

  if (formEspecialidad) {
    formEspecialidad.addEventListener('submit', altaEspecialidad);
  }
  if (cancelarBtn) {
    cancelarBtn.addEventListener('click', restablecerFormulario);
  }

  renderizarEspecialidades();
}

document.addEventListener('DOMContentLoaded', init);
