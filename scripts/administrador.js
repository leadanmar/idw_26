import { medicosIniciales } from '../config/medicos.js';
import {
  inicializarInputImagen,
  generarSelectEspecialidades,
  generarObrasSociales,
  obtenerObrasSeleccionadas,
  imagenBase64,
} from './formularioMedicos.js';
import { renderizarMedicos } from './tablaMedicos.js';

if (!localStorage.getItem('medicos')) {
  localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
}

let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
let nextId = medicos.length > 0 ? Math.max(...medicos.map((m) => m.id)) + 1 : 1;
let modoEdicion = false;

function altaMedicos(event) {
  event.preventDefault();

  const inputNombre = document.getElementById('nombre_completo');
  const inputEspecialidad = document.getElementById('especialidad');
  const inputTelefono = document.getElementById('telefono');
  const inputEmail = document.getElementById('email');
  const inputDescripcion = document.getElementById('descripcion');
  const inputValorConsulta = document.getElementById('valorConsulta');
  const medicoIdInput = document.getElementById('medicoId');
  const preview = document.getElementById('preview');

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
    document.getElementById('altaMedicoForm').reset();
  }
}

function cargarMedicoParaEdicion(id) {
  const medico = medicos.find((m) => m.id === id);
  if (medico) {
    const inputNombre = document.getElementById('nombre_completo');
    const inputEspecialidad = document.getElementById('especialidad');
    const inputTelefono = document.getElementById('telefono');
    const inputEmail = document.getElementById('email');
    const inputDescripcion = document.getElementById('descripcion');
    const inputValorConsulta = document.getElementById('valorConsulta');
    const medicoIdInput = document.getElementById('medicoId');
    const submitBtn = document.getElementById('submitBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');

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
  const formAltaMedico = document.getElementById('altaMedicoForm');
  const medicoIdInput = document.getElementById('medicoId');
  const submitBtn = document.getElementById('submitBtn');
  const cancelarBtn = document.getElementById('cancelarBtn');
  const preview = document.getElementById('preview');

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

    const medicoIdInput = document.getElementById('medicoId');
    if (parseInt(medicoIdInput.value) === id) {
      restablecerFormulario();
    }

    guardarYRenderizar();
  }
}

function guardarYRenderizar() {
  localStorage.setItem('medicos', JSON.stringify(medicos));
  const tablaBody = document.querySelector('#tablaMedicos tbody');
  renderizarMedicos(
    tablaBody,
    medicos,
    cargarMedicoParaEdicion,
    eliminarMedico
  );
}

function init() {
  const formAltaMedico = document.getElementById('altaMedicoForm');
  const cancelarBtn = document.getElementById('cancelarBtn');
  const preview = document.getElementById('preview');

  preview.style.display = 'none';

  if (formAltaMedico) formAltaMedico.addEventListener('submit', altaMedicos);
  if (cancelarBtn) cancelarBtn.addEventListener('click', restablecerFormulario);

  inicializarInputImagen();
  generarSelectEspecialidades();
  generarObrasSociales();

  guardarYRenderizar();
}

document.addEventListener('DOMContentLoaded', init);

window.cargarMedicoParaEdicion = cargarMedicoParaEdicion;
window.eliminarMedico = eliminarMedico;
