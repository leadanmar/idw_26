import { medicosIniciales } from '../config/medicos.js';
import { especialidadesIniciales } from '../config/especialidades.js';
import { obrasSocialesIniciales } from '../config/obrasSociales.js';

if (!localStorage.getItem('obrasSociales')) {
  localStorage.setItem('obrasSociales', JSON.stringify(obrasSocialesIniciales));
}

let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];

if (!localStorage.getItem('especialidades')) {
  localStorage.setItem(
    'especialidades',
    JSON.stringify(especialidadesIniciales)
  );
}

let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];

if (!localStorage.getItem('medicos')) {
  localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
}

const contenedor = document.getElementById('contenedorCards');
const selectFiltro = document.getElementById('filtroEspecialidad');
const medicos = JSON.parse(localStorage.getItem('medicos'));
const imgRandom = 'img/profesionales/random.jpg';

function obtenerNombreEspecialidad(id) {
  const especialidad = especialidades.find((esp) => esp.id === id);
  return especialidad ? especialidad.nombre : 'Especialidad no encontrada';
}

function obtenerObrasSocialesMedico(obrasSocialesIds) {
  return obrasSociales.filter((obraSocial) =>
    obrasSocialesIds.includes(obraSocial.id)
  );
}

function crearCards(medicosFiltrados = medicos) {
  contenedor.innerHTML = '';

  medicosFiltrados.forEach((medico) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4';

    let imgHTML = '';
    if (medico.img && medico.img.trim() !== '') {
      imgHTML = `<img src="${medico.img}" class="card-img-top" alt="${medico.nombre_completo}" />`;
    } else {
      imgHTML = `<img src=${imgRandom} class="card-img-top" alt="${medico.nombre_completo}" />`;
    }

    const nombreEspecialidad = obtenerNombreEspecialidad(
      medico.especialidad_id
    );
    const obrasSocialesMedico = obtenerObrasSocialesMedico(
      medico.obras_sociales || []
    );

    let obrasSocialesHTML = '';
    if (obrasSocialesMedico.length > 0) {
      obrasSocialesHTML = `
      <div class="mt-auto"> 
        <div class="d-flex flex-wrap gap-1 mt-1 justify-content-center">
          ${obrasSocialesMedico
            .map(
              (obraSocial) =>
                `<span class="badge bg-success">${obraSocial.nombre}</span>`
            )
            .join('')}
        </div>
      </div>
    `;
    }

    col.innerHTML = `
    <div class="card h-100 shadow-sm">
      ${imgHTML}
      <div class="card-body text-center d-flex flex-column">
        <div>
          <h3 class="card-title mb-3">${medico.nombre_completo}</h3>
          <h5 class="card-text mb-4">${nombreEspecialidad}</h5>
          <p class="card-text fs-6 lh-sm mb-2">${medico.descripcion}</p>
        </div>
        ${obrasSocialesHTML}
      </div>
    </div>
  `;

    contenedor.appendChild(col);
  });
}

function cargarOpcionesFiltro() {
  especialidades.forEach((especialidad) => {
    const option = document.createElement('option');
    option.value = especialidad.id;
    option.textContent = especialidad.nombre;
    selectFiltro.appendChild(option);
  });
}

function configurarFiltro() {
  selectFiltro.addEventListener('change', function (e) {
    const especialidadId = e.target.value;

    if (especialidadId === '') {
      crearCards(medicos);
    } else {
      const medicosFiltrados = medicos.filter(
        (medico) => medico.especialidad_id === parseInt(especialidadId)
      );
      crearCards(medicosFiltrados);
    }
  });
}

function init() {
  cargarOpcionesFiltro();
  configurarFiltro();
  crearCards();
}

document.addEventListener('DOMContentLoaded', init);
