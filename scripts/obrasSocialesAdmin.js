import { obrasSocialesIniciales } from '../config/obrasSociales.js';

if (!localStorage.getItem('obrasSociales')) {
  localStorage.setItem('obrasSociales', JSON.stringify(obrasSocialesIniciales));
}

let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
function generarId() {
  return Math.floor(100000 + Math.random() * 900000);
}
let nextId = generarId();
let modoEdicion = false;

let formObraSocial, tablaBody, obraSocialIdInput, submitBtn, cancelarBtn;
let inputNombre, inputDescripcion;

function guardarYRenderizar() {
  localStorage.setItem('obrasSociales', JSON.stringify(obrasSociales));
  renderizarObrasSociales();
}

function renderizarObrasSociales() {
  if (!tablaBody) return;

  const filasHTML = obrasSociales
    .map(
      (obraSocial) => `
        <tr data-id="${obraSocial.id}">
            <td>${obraSocial.id}</td>
            <td>${obraSocial.nombre}</td>
            <td>${
              obraSocial.descripcion
                ? obraSocial.descripcion.length > 50
                  ? obraSocial.descripcion.substring(0, 50) + '...'
                  : obraSocial.descripcion
                : ''
            }</td>
            <td>
                <button class="btn btn-sm btn-warning me-2 btn-modificar" data-id="${
                  obraSocial.id
                }">
                    Modificar
                </button>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${
                  obraSocial.id
                }">
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
      cargarObraSocialParaEdicion(id);
    });
  });

  // Event listeners para botones eliminar
  const botonesEliminar = tablaBody.querySelectorAll('.btn-eliminar');
  botonesEliminar.forEach((boton) => {
    boton.addEventListener('click', function () {
      const id = parseInt(this.getAttribute('data-id'));
      eliminarObraSocial(id);
    });
  });
}

function altaObraSocial(event) {
  event.preventDefault();

  const datosObraSocial = {
    nombre: inputNombre.value.trim(),
    descripcion: inputDescripcion.value.trim(),
  };

  if (!datosObraSocial.nombre) {
    alert('Complete el campo requerido (Nombre)');
    return;
  }

  if (modoEdicion) {
    const idAActualizar = parseInt(obraSocialIdInput.value);
    const indice = obrasSociales.findIndex((o) => o.id === idAActualizar);

    if (indice !== -1) {
      obrasSociales[indice] = { id: idAActualizar, ...datosObraSocial };
      alert(`Obra Social ID ${idAActualizar} modificada.`);
      guardarYRenderizar();
      restablecerFormulario();
    }
  } else {
    const nuevaObraSocial = { id: generarId(), ...datosObraSocial };
    obrasSociales.push(nuevaObraSocial);
    alert(`Obra Social ${datosObraSocial.nombre} registrada.`);
    guardarYRenderizar();
    restablecerFormulario();
  }
}

function cargarObraSocialParaEdicion(id) {
  const obraSocial = obrasSociales.find((o) => o.id === id);
  if (obraSocial) {
    inputNombre.value = obraSocial.nombre;
    inputDescripcion.value = obraSocial.descripcion || '';

    obraSocialIdInput.value = obraSocial.id;
    modoEdicion = true;
    submitBtn.textContent = 'Guardar Cambios';
    cancelarBtn.style.display = 'inline-block';
  }
}

function restablecerFormulario() {
  formObraSocial.reset();
  obraSocialIdInput.value = '';
  modoEdicion = false;
  submitBtn.textContent = 'Registrar Obra Social';
  cancelarBtn.style.display = 'none';
}

function eliminarObraSocial(id) {
  if (
    confirm(
      `¿Estás seguro de que quieres eliminar la obra social con ID ${id}?`
    )
  ) {
    obrasSociales = obrasSociales.filter((obraSocial) => obraSocial.id !== id);
    alert('Obra Social eliminada.');

    if (parseInt(obraSocialIdInput.value) === id) {
      restablecerFormulario();
    }

    guardarYRenderizar();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  formObraSocial = document.getElementById('altaObraSocialForm');
  tablaBody = document.querySelector('#tablaObrasSociales tbody');
  obraSocialIdInput = document.getElementById('obraSocialId');
  submitBtn = document.getElementById('submitBtn');
  cancelarBtn = document.getElementById('cancelarBtn');

  inputNombre = document.getElementById('nombre');
  inputDescripcion = document.getElementById('descripcion');

  if (formObraSocial) formObraSocial.addEventListener('submit', altaObraSocial);
  if (cancelarBtn) cancelarBtn.addEventListener('click', restablecerFormulario);

  renderizarObrasSociales();
});
