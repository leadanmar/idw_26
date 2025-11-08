import { obrasSocialesIniciales } from '../config/obrasSociales.js';
import { especialidadesIniciales } from '../config/especialidades.js';

if (!localStorage.getItem('especialidades')) {
  localStorage.setItem(
    'especialidades',
    JSON.stringify(especialidadesIniciales)
  );
}

let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];

if (!localStorage.getItem('obrasSociales')) {
  localStorage.setItem('obrasSociales', JSON.stringify(obrasSocialesIniciales));
}

let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];

export function obtenerNombreEspecialidad(id) {
  const especialidad = especialidades.find((esp) => esp.id === id);
  return especialidad ? especialidad.nombre : 'Especialidad no encontrada';
}

function obtenerObrasSocialesStr(obras_sociales) {
  if (!Array.isArray(obras_sociales)) return '';

  return obras_sociales
    .map((id) => {
      const obra = obrasSociales.find((o) => o.id === id);
      return obra ? obra.nombre : '';
    })
    .join(', ');
}

function truncarDescripcion(descripcion) {
  if (!descripcion) return '';
  return descripcion.length > 50
    ? descripcion.substring(0, 50) + '...'
    : descripcion;
}

function obtenerImagenSrc(medico) {
  return medico.img && medico.img.trim() !== ''
    ? medico.img
    : 'img/profesionales/random.jpg';
}

export function renderizarMedicos(
  tablaBody,
  medicos,
  cargarMedicoParaEdicion,
  eliminarMedico
) {
  if (!tablaBody) return;

  const filasHTML = medicos
    .map(
      (medico) => `
    <tr>
      <td>${medico.id}</td>
      <td>${medico.nombre_completo}</td>
      <td>${obtenerNombreEspecialidad(medico.especialidad_id)}</td>
      <td>${obtenerObrasSocialesStr(medico.obras_sociales)}</td>
      <td>${medico.telefono}</td>
      <td>${medico.email}</td>
      <td>${truncarDescripcion(medico.descripcion)}</td>
      <td>${medico.valor_consulta ? `$${medico.valor_consulta}` : '-'}</td>
      <td>
        <img src="${obtenerImagenSrc(medico)}" 
             alt="${medico.nombre_completo}"
             style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
      </td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="cargarMedicoParaEdicion(${
          medico.id
        })">
          Modificar
        </button>
        <button class="btn btn-sm btn-danger" onclick="eliminarMedico(${
          medico.id
        })">
          Eliminar
        </button>
      </td>
    </tr>
  `
    )
    .join('');

  tablaBody.innerHTML = filasHTML;
}
