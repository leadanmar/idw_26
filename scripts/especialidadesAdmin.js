import { especialidadesIniciales } from '../config/especialidades.js';

if (!localStorage.getItem('especialidades')) {
  localStorage.setItem(
    'especialidades',
    JSON.stringify(especialidadesIniciales)
  );
}

let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
function generarId() {
  return Math.floor(100000 + Math.random() * 900000);
}
let modoEdicion = false;

let formEspecialidad, tablaBody, especialidadIdInput, submitBtn, cancelarBtn;
let inputNombre;

function guardarYRenderizar() {
  localStorage.setItem('especialidades', JSON.stringify(especialidades));
  renderizarEspecialidades();
}

function renderizarEspecialidades() {
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

  const botonesModificar = tablaBody.querySelectorAll('.btn-modificar');
  botonesModificar.forEach((boton) => {
    boton.addEventListener('click', function () {
      const id = parseInt(this.getAttribute('data-id'));
      cargarEspecialidadParaEdicion(id);
    });
  });

  const botonesEliminar = tablaBody.querySelectorAll('.btn-eliminar');
  botonesEliminar.forEach((boton) => {
    boton.addEventListener('click', function () {
      const id = parseInt(this.getAttribute('data-id'));
      eliminarEspecialidad(id);
    });
  });
}

function altaEspecialidad(event) {
  event.preventDefault();

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
      guardarYRenderizar();
      restablecerFormulario();
    }
  } else {
    const nuevaEspecialidad = { id: generarId(), ...datosEspecialidad };
    especialidades.push(nuevaEspecialidad);
    alert(`Especialidad ${datosEspecialidad.nombre} registrada.`);
    guardarYRenderizar();
    restablecerFormulario();
  }
}

function cargarEspecialidadParaEdicion(id) {
  const especialidad = especialidades.find((e) => e.id === id);
  if (especialidad) {
    inputNombre.value = especialidad.nombre;

    especialidadIdInput.value = especialidad.id;
    modoEdicion = true;
    submitBtn.textContent = 'Guardar Cambios';
    cancelarBtn.style.display = 'inline-block';
  }
}

function restablecerFormulario() {
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

    if (parseInt(especialidadIdInput.value) === id) {
      restablecerFormulario();
    }

    guardarYRenderizar();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  formEspecialidad = document.getElementById('altaEspecialidadForm');
  tablaBody = document.querySelector('#tablaEspecialidades tbody');
  especialidadIdInput = document.getElementById('especialidadId');
  submitBtn = document.getElementById('submitBtn');
  cancelarBtn = document.getElementById('cancelarBtn');

  inputNombre = document.getElementById('nombre');

  if (formEspecialidad)
    formEspecialidad.addEventListener('submit', altaEspecialidad);
  if (cancelarBtn) cancelarBtn.addEventListener('click', restablecerFormulario);

  renderizarEspecialidades();
});
