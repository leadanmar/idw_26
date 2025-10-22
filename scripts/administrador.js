import { medicosIniciales } from '../config/medicos.js';

const inputImagen = document.getElementById('inputImagen');
const preview = document.getElementById('preview');

if (!localStorage.getItem('medicos')) {
  localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
}

let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
let nextId = medicos.length > 0 ? Math.max(...medicos.map((m) => m.id)) + 1 : 1;
let modoEdicion = false;

let formAltaMedico, tablaBody, medicoIdInput, submitBtn, cancelarBtn;
let inputNombre, inputEspecialidad, inputObraSocial, inputTelefono, inputEmail;

///Input Image
let imagenBase64 = '';

preview.style.display = 'none';
inputImagen.addEventListener('change', function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagenBase64 = e.target.result;
      preview.src = imagenBase64;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    // No hay archivo seleccionado
    imagenBase64 = '';
    preview.src = '';
    preview.style.display = 'none';
  }
});

//Renderizado de tabla
function renderizarMedicos() {
  if (!tablaBody) return;

  tablaBody.innerHTML = '';

  medicos.forEach((medico) => {
    const fila = tablaBody.insertRow();

    fila.insertCell().textContent = medico.id;
    fila.insertCell().textContent = medico.nombre_completo;
    fila.insertCell().textContent = medico.especialidad;
    fila.insertCell().textContent = medico.obra_social;
    fila.insertCell().textContent = medico.telefono;
    fila.insertCell().textContent = medico.email;
    // Insertar la imagen
    const celdaImagen = fila.insertCell();
    const img = document.createElement('img');
    img.src =
      medico.img && medico.img.trim() !== ''
        ? medico.img
        : 'img/profesionales/random.jpg';
    img.alt = medico.nombre_completo;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '5px';
    celdaImagen.appendChild(img);

    const celdaAcciones = fila.insertCell();

    const btnModificar = document.createElement('button');
    btnModificar.textContent = 'Modificar';
    btnModificar.className = 'btn btn-sm btn-warning me-2';
    btnModificar.onclick = () => cargarMedicoParaEdicion(medico.id);
    celdaAcciones.appendChild(btnModificar);

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn btn-sm btn-danger';
    btnEliminar.onclick = () => eliminarMedico(medico.id);
    celdaAcciones.appendChild(btnEliminar);
  });
}

///Alta medicos
function altaMedicos(event) {
  event.preventDefault();

  let nombre_completo = inputNombre.value.trim();
  let especialidad = inputEspecialidad.value.trim();
  let obra_social = inputObraSocial.value.trim();
  let telefono = inputTelefono.value.trim();
  let email = inputEmail.value.trim();
  let img = imagenBase64 || '';

  if (!nombre_completo || !especialidad || !obra_social) {
    alert('Complete los campos requeridos (Nombre, Especialidad, Obra Social)');
    return;
  }

  const datosMedico = {
    nombre_completo,
    especialidad,
    obra_social,
    telefono,
    email,
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
    restablecerFormulario();
  } else {
    const nuevoMedico = { id: nextId++, ...datosMedico };
    medicos.push(nuevoMedico);
    alert(`Médico ${nombre_completo} registrado.`);
    guardarYRenderizar();
    preview.style.display = 'none';
    formAltaMedico.reset();
  }
}

///Cargar medicos para edicion

function cargarMedicoParaEdicion(id) {
  const medico = medicos.find((m) => m.id === id);
  if (medico) {
    inputNombre.value = medico.nombre_completo;
    inputEspecialidad.value = medico.especialidad;
    inputObraSocial.value = medico.obra_social;
    inputTelefono.value = medico.telefono;
    inputEmail.value = medico.email;

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
}

//Eliminar
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
  renderizarMedicos();
}

//asignacion de inputs
document.addEventListener('DOMContentLoaded', function () {
  formAltaMedico = document.getElementById('altaMedicoForm');
  tablaBody = document.querySelector('#tablaMedicos tbody');
  medicoIdInput = document.getElementById('medicoId');
  submitBtn = document.getElementById('submitBtn');
  cancelarBtn = document.getElementById('cancelarBtn');

  inputNombre = document.getElementById('nombre_completo');
  inputEspecialidad = document.getElementById('especialidad');
  inputObraSocial = document.getElementById('obra_social');
  inputTelefono = document.getElementById('telefono');
  inputEmail = document.getElementById('email');

  if (formAltaMedico) formAltaMedico.addEventListener('submit', altaMedicos);
  if (cancelarBtn) cancelarBtn.addEventListener('click', restablecerFormulario);

  renderizarMedicos();
});
