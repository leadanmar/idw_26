import { medicosIniciales } from '../config/medicos.js';

if (!localStorage.getItem('medicos')) {
  localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
}

const contenedor = document.getElementById('contenedorCards');
const medicos = JSON.parse(localStorage.getItem('medicos'));
const imgRandom = 'img/profesionales/random.jpg';

medicos.forEach((medico) => {
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-md-4';

  let imgHTML = '';
  if (medico.img && medico.img.trim() !== '') {
    imgHTML = `<img src="${medico.img}" class="card-img-top" alt="${medico.nombre_completo}" />`;
  } else {
    imgHTML = `<img src=${imgRandom} class="card-img-top" alt="${medico.nombre_completo}" />`;
  }

  col.innerHTML = `
      <div class="card h-100 shadow-sm">
        ${imgHTML}
        <div class="card-body text-center">
          <h5 class="card-title">${medico.nombre_completo}</h5>
          <p class="card-text">${medico.especialidad}</p>
        </div>
      </div>
    `;

  contenedor.appendChild(col);
});
