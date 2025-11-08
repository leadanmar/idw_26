import { medicosIniciales } from '../config/medicos.js';
import {
  inicializarInputImagen,
  generarSelectEspecialidades,
  generarObrasSociales,
  obtenerObrasSeleccionadas,
  imagenBase64,
} from './formularioMedicos.js';
import { renderizarMedicos } from './tablaMedicos.js';

const inputImagen = document.getElementById('inputImagen');
const preview = document.getElementById('preview');

if (!localStorage.getItem('medicos')) {
  localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
}

let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
let nextId = medicos.length > 0 ? Math.max(...medicos.map((m) => m.id)) + 1 : 1;
let modoEdicion = false;

let formAltaMedico, tablaBody, medicoIdInput, submitBtn, cancelarBtn;
let inputNombre,
  inputEspecialidad,
  inputTelefono,
  inputEmail,
  inputDescripcion,
  inputValorConsulta;

preview.style.display = 'none';

function altaMedicos(event) {
  event.preventDefault();

  let nombre_completo = inputNombre.value.trim();
  let especialidad_id = parseInt(inputEspecialidad.value);
  let obras_sociales = obtenerObrasSeleccionadas();
  let telefono = inputTelefono.value.trim();
  let email = inputEmail.value.trim();
  let descripcion = inputDescripcion.value.trim();
  let valor_consulta = inputValorConsulta.value
    ? parseFloat(inputValorConsulta.value)
    : null;
  let img = imagenBase64 || '';

  if (!nombre_completo || !especialidad_id) {
    alert('Complete los campos requeridos (Nombre y Especialidad)');
    return;
  }

  const datosMedico = {
    nombre_completo,
    especialidad_id,
    obras_sociales,
    telefono,
    email,
    descripcion,
    valor_consulta,
    img,
  };

  if (modoEdicion) {
    const idAActualizar = parseInt(medicoIdInput.value);
    const indice = medicos.findIndex((m) => m.id === idAActualizar);

    if (indice !== -1) {
      medicos[indice] = { id: idAActualizar, ...datosMedico };
      alert(`Médico ID ${idAActualizar} modificado.`);
      guardarYRenderizar();
      restablecerFormulario();
    }
  } else {
    const nuevoMedico = { id: nextId++, ...datosMedico };
    medicos.push(nuevoMedico);
    alert(`Médico ${nombre_completo} registrado.`);
    guardarYRenderizar();
    preview.style.display = 'none';
    formAltaMedico.reset();
  }
}

function cargarMedicoParaEdicion(id) {
  const medico = medicos.find((m) => m.id === id);
  if (medico) {
    inputNombre.value = medico.nombre_completo;
    inputEspecialidad.value = medico.especialidad_id;
    inputTelefono.value = medico.telefono;
    inputEmail.value = medico.email;
    inputDescripcion.value = medico.descripcion || '';
    inputValorConsulta.value = medico.valor_consulta || '';

    const checkboxes = document.querySelectorAll(
      '#obrasSocialesContainer input'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = Array.isArray(medico.obras_sociales)
        ? medico.obras_sociales.includes(parseInt(checkbox.value))
        : false;
    });

    medicoIdInput.value = medico.id;
    modoEdicion = true;
    submitBtn.textContent = 'Guardar Cambios';
    cancelarBtn.style.display = 'inline-block';
  }
}

function restablecerFormulario() {
  formAltaMedico.reset();
  medicoIdInput.value = '';
  modoEdicion = false;
  submitBtn.textContent = 'Registrar Medico';
  cancelarBtn.style.display = 'none';
  imagenBase64 = '';
  preview.style.display = 'none';

  const checkboxes = document.querySelectorAll('#obrasSocialesContainer input');
  checkboxes.forEach((checkbox) => (checkbox.checked = false));
}

function eliminarMedico(id) {
  if (
    confirm(`¿Estás seguro de que quieres eliminar al médico con ID ${id}?`)
  ) {
    medicos = medicos.filter((medico) => medico.id !== id);
    alert('Médico eliminado.');

    if (parseInt(medicoIdInput.value) === id) {
      restablecerFormulario();
    }

    guardarYRenderizar();
  }
}

function guardarYRenderizar() {
  localStorage.setItem('medicos', JSON.stringify(medicos));
  renderizarMedicos(
    tablaBody,
    medicos,
    cargarMedicoParaEdicion,
    eliminarMedico
  );
}

document.addEventListener('DOMContentLoaded', function () {
  formAltaMedico = document.getElementById('altaMedicoForm');
  tablaBody = document.querySelector('#tablaMedicos tbody');
  medicoIdInput = document.getElementById('medicoId');
  submitBtn = document.getElementById('submitBtn');
  cancelarBtn = document.getElementById('cancelarBtn');

  inputNombre = document.getElementById('nombre_completo');
  inputEspecialidad = document.getElementById('especialidad');
  inputTelefono = document.getElementById('telefono');
  inputEmail = document.getElementById('email');
  inputDescripcion = document.getElementById('descripcion');
  inputValorConsulta = document.getElementById('valorConsulta');

  if (formAltaMedico) formAltaMedico.addEventListener('submit', altaMedicos);
  if (cancelarBtn) cancelarBtn.addEventListener('click', restablecerFormulario);

  inicializarInputImagen();
  generarSelectEspecialidades();
  generarObrasSociales();

  renderizarMedicos(
    tablaBody,
    medicos,
    cargarMedicoParaEdicion,
    eliminarMedico
  );
});

window.cargarMedicoParaEdicion = cargarMedicoParaEdicion;
window.eliminarMedico = eliminarMedico;
