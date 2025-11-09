import { obrasSocialesIniciales } from '../config/obrasSociales.js';
import { especialidadesIniciales } from '../config/especialidades.js';
import { medicosIniciales } from '../config/medicos.js';

// Inicializar datos en localStorage
if (!localStorage.getItem('especialidades')) {
  localStorage.setItem(
    'especialidades',
    JSON.stringify(especialidadesIniciales)
  );
}

if (!localStorage.getItem('obrasSociales')) {
  localStorage.setItem('obrasSociales', JSON.stringify(obrasSocialesIniciales));
}

if (!localStorage.getItem('medicos')) {
  localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
}

if (!localStorage.getItem('reservas')) {
  localStorage.setItem('reservas', JSON.stringify([]));
}

let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

// Cargar obras sociales en el select (agregando opción "Ninguna")
function cargarObrasSociales() {
  const selectObraSocial = document.getElementById('obraSocial');
  selectObraSocial.innerHTML =
    '<option value="">Seleccione una obra social</option>';

  // Agregar opción "Ninguna"
  const optionNinguna = document.createElement('option');
  optionNinguna.value = 'ninguna';
  optionNinguna.textContent = 'Ninguna';
  selectObraSocial.appendChild(optionNinguna);

  obrasSociales.forEach((obraSocial) => {
    const option = document.createElement('option');
    option.value = obraSocial.id;
    option.textContent = obraSocial.nombre;
    selectObraSocial.appendChild(option);
  });
}

// Cargar especialidades en el select
function cargarEspecialidades() {
  const selectEspecialidad = document.getElementById('especialidad');
  selectEspecialidad.innerHTML =
    '<option value="">Todas las especialidades</option>';

  especialidades.forEach((especialidad) => {
    const option = document.createElement('option');
    option.value = especialidad.id;
    option.textContent = especialidad.nombre;
    selectEspecialidad.appendChild(option);
  });
}

// Cargar médicos en el select (con filtro opcional)
function cargarMedicos(especialidadId = null) {
  const selectMedico = document.getElementById('medico');
  selectMedico.innerHTML = '<option value="">Seleccione un médico</option>';

  let medicosFiltrados = medicos;

  if (especialidadId) {
    const especialidadIdNum = parseInt(especialidadId);
    medicosFiltrados = medicos.filter((medico) => {
      return medico.especialidad_id === especialidadIdNum;
    });
  }

  medicosFiltrados.forEach((medico) => {
    const option = document.createElement('option');
    option.value = medico.id;
    option.textContent = medico.nombre_completo;
    selectMedico.appendChild(option);
  });
}

// Filtrar médicos cuando cambia la especialidad
function configurarFiltroMedicos() {
  const selectEspecialidad = document.getElementById('especialidad');

  selectEspecialidad.addEventListener('change', function (event) {
    const especialidadId = event.target.value;
    cargarMedicos(especialidadId);
  });
}

// Inicializar todo cuando cargue la página
function init() {
  cargarObrasSociales();
  cargarEspecialidades();
  cargarMedicos();
  configurarFiltroMedicos();
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
