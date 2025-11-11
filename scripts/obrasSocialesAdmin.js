import { obrasSocialesIniciales } from '../config/obrasSociales.js';

if (!localStorage.getItem('obrasSociales')) {
  localStorage.setItem('obrasSociales', JSON.stringify(obrasSocialesIniciales));
}

let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
let modoEdicion = false;

function generarId() {
  return Math.floor(100000 + Math.random() * 900000);
}

function guardarEnLocalStorage() {
  localStorage.setItem('obrasSociales', JSON.stringify(obrasSociales));
}

function renderizarObrasSociales() {
  const tablaBody = document.querySelector('#tablaObrasSociales tbody');
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
            <td>${obraSocial.descuentoConsulta || 0}%</td>
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

  document.querySelectorAll('.btn-modificar').forEach((boton) => {
    boton.addEventListener('click', function () {
      const id = parseInt(this.getAttribute('data-id'));
      cargarObraSocialParaEdicion(id);
    });
  });

  document.querySelectorAll('.btn-eliminar').forEach((boton) => {
    boton.addEventListener('click', function () {
      const id = parseInt(this.getAttribute('data-id'));
      eliminarObraSocial(id);
    });
  });
}

function altaObraSocial(event) {
  event.preventDefault();

  const formObraSocial = document.getElementById('altaObraSocialForm');
  const inputNombre = document.getElementById('nombre');
  const inputDescripcion = document.getElementById('descripcion');
  const inputDescuentoConsulta = document.getElementById('descuentoConsulta');
  const obraSocialIdInput = document.getElementById('obraSocialId');

  const datosObraSocial = {
    nombre: inputNombre.value.trim(),
    descripcion: inputDescripcion.value.trim(),
    descuentoConsulta: inputDescuentoConsulta.value
      ? parseFloat(inputDescuentoConsulta.value)
      : 0,
  };

  if (!datosObraSocial.nombre) {
    alert('Complete el campo requerido (Nombre)');
    return;
  }

  if (modoEdicion) {
    const idAActualizar = parseInt(obraSocialIdInput.value);
    const indice = obrasSociales.findIndex((o) => o.id === idAActualizar);

    if (indice !== -1) {
      obrasSociales[indice] = {
        id: idAActualizar,
        ...datosObraSocial,
      };
      alert(`Obra Social ID ${idAActualizar} modificada.`);
      guardarEnLocalStorage();
      renderizarObrasSociales();
      restablecerFormulario();
    }
  } else {
    const nuevaObraSocial = {
      id: generarId(),
      ...datosObraSocial,
    };
    obrasSociales.push(nuevaObraSocial);
    alert(`Obra Social ${datosObraSocial.nombre} registrada.`);
    guardarEnLocalStorage();
    renderizarObrasSociales();
    restablecerFormulario();
  }
}

function cargarObraSocialParaEdicion(id) {
  const obraSocial = obrasSociales.find((o) => o.id === id);
  if (obraSocial) {
    const inputNombre = document.getElementById('nombre');
    const inputDescripcion = document.getElementById('descripcion');
    const inputDescuentoConsulta = document.getElementById('descuentoConsulta');
    const obraSocialIdInput = document.getElementById('obraSocialId');
    const submitBtn = document.getElementById('submitBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');

    inputNombre.value = obraSocial.nombre;
    inputDescripcion.value = obraSocial.descripcion || '';
    inputDescuentoConsulta.value = obraSocial.descuentoConsulta || 0;

    obraSocialIdInput.value = obraSocial.id;
    modoEdicion = true;
    submitBtn.textContent = 'Guardar Cambios';
    cancelarBtn.style.display = 'inline-block';
  }
}

function restablecerFormulario() {
  const formObraSocial = document.getElementById('altaObraSocialForm');
  const obraSocialIdInput = document.getElementById('obraSocialId');
  const submitBtn = document.getElementById('submitBtn');
  const cancelarBtn = document.getElementById('cancelarBtn');

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

    const obraSocialIdInput = document.getElementById('obraSocialId');
    if (parseInt(obraSocialIdInput.value) === id) {
      restablecerFormulario();
    }

    guardarEnLocalStorage();
    renderizarObrasSociales();
  }
}

function init() {
  const formObraSocial = document.getElementById('altaObraSocialForm');
  const cancelarBtn = document.getElementById('cancelarBtn');

  if (formObraSocial) {
    formObraSocial.addEventListener('submit', altaObraSocial);
  }
  if (cancelarBtn) {
    cancelarBtn.addEventListener('click', restablecerFormulario);
  }

  renderizarObrasSociales();
}

document.addEventListener('DOMContentLoaded', init);
