import { medicosIniciales } from '../config/medicos.js';
import { especialidadesIniciales } from '../config/especialidades.js';

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
const medicos = JSON.parse(localStorage.getItem('medicos'));
const imgRandom = 'img/profesionales/random.jpg';

function obtenerNombreEspecialidad(id) {
  const especialidad = especialidades.find((esp) => esp.id === id);
  return especialidad ? especialidad.nombre : 'Especialidad no encontrada';
}

medicos.forEach((medico) => {
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-md-4';

  let imgHTML = '';
  if (medico.img && medico.img.trim() !== '') {
    imgHTML = `<img src="${medico.img}" class="card-img-top" alt="${medico.nombre_completo}" />`;
  } else {
    imgHTML = `<img src=${imgRandom} class="card-img-top" alt="${medico.nombre_completo}" />`;
  }

  const nombreEspecialidad = obtenerNombreEspecialidad(medico.especialidad_id);

  col.innerHTML = `
      <div class="card h-100 shadow-sm">
        ${imgHTML}
        <div class="card-body text-center">
          <h5 class="card-title">${medico.nombre_completo}</h5>
          <p class="card-text">${nombreEspecialidad}</p>
        </div>
      </div>
    `;

  contenedor.appendChild(col);
});
