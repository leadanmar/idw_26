import { medicosIniciales } from '../config/medicos.js';
import { especialidadesIniciales } from '../config/especialidades.js';

if (!localStorage.getItem('medicos')) {
  localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
}
if (!localStorage.getItem('especialidades')) {
  localStorage.setItem(
    'especialidades',
    JSON.stringify(especialidadesIniciales)
  );
}

let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

function cargarMedicos() {
  const selectFiltro = document.getElementById('filtroMedico');
  const selectModal = document.getElementById('editarMedicoReserva');

  selectFiltro.innerHTML = '<option value="">Todos los médicos</option>';
  selectModal.innerHTML = '<option value="">Seleccione médico</option>';

  medicos.forEach((medico) => {
    const optionFiltro = document.createElement('option');
    optionFiltro.value = medico.id;
    optionFiltro.textContent = medico.nombre_completo;
    selectFiltro.appendChild(optionFiltro);

    const optionModal = document.createElement('option');
    optionModal.value = medico.id;
    optionModal.textContent = medico.nombre_completo;
    selectModal.appendChild(optionModal);
  });
}

function cargarReservas(filtroMedicoId = '', filtroDNI = '') {
  const tbody = document.querySelector('#tablaReservas tbody');
  tbody.innerHTML = '';

  let reservasFiltradas = reservas;

  // Aplicar filtro por médico
  if (filtroMedicoId) {
    reservasFiltradas = reservasFiltradas.filter(
      (reserva) => parseInt(reserva.medicoId) === parseInt(filtroMedicoId)
    );
  }

  // Aplicar filtro por DNI (reutilizando la lógica del otro script)
  if (filtroDNI) {
    reservasFiltradas = reservasFiltradas.filter((reserva) =>
      reserva.documento.includes(filtroDNI)
    );
  }

  if (reservasFiltradas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="text-center text-muted">
          No se encontraron reservas con los filtros aplicados
        </td>
      </tr>
    `;
    return;
  }

  reservasFiltradas.forEach((reserva) => {
    const medico = medicos.find((m) => m.id === parseInt(reserva.medicoId));
    const especialidad = especialidades.find(
      (e) => e.id === reserva.especialidadId
    );
    const fechaReserva = new Date(reserva.fechaReserva);

    const fila = document.createElement('tr');
    fila.innerHTML = `
            <td>${reserva.id}</td>
            <td>${reserva.apellidoNombre}</td>
            <td>${reserva.documento}</td>
            <td>${medico ? medico.nombre_completo : 'No encontrado'}</td>
            <td>${especialidad ? especialidad.nombre : 'No encontrada'}</td>
            <td>${reserva.fecha}</td>
            <td>${reserva.hora}</td>
            <td>$${reserva.valorConsulta}</td>
            <td>
                <span class="badge ${
                  reserva.estado ? 'bg-success' : 'bg-danger'
                }">
                    ${reserva.estado ? 'Activa' : 'Cancelada'}
                </span>
            </td>
            <td>
                <button class="btn btn-warning btn-sm btn-editar" data-id="${
                  reserva.id
                }">Editar</button>
                <button class="btn ${
                  reserva.estado ? 'btn-danger' : 'btn-success'
                } btn-sm btn-cambiar-estado" data-id="${reserva.id}">
                    ${reserva.estado ? 'Cancelar' : 'Activar'}
                </button>
            </td>
        `;
    tbody.appendChild(fila);
  });

  document.querySelectorAll('.btn-editar').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const reservaId = e.target.getAttribute('data-id');
      editarReserva(reservaId);
    });
  });

  document.querySelectorAll('.btn-cambiar-estado').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const reservaId = e.target.getAttribute('data-id');
      cambiarEstadoReserva(reservaId);
    });
  });
}

// Las demás funciones (editarReserva, cambiarEstadoReserva, guardarCambiosReserva) se mantienen igual

function aplicarFiltros() {
  const filtroMedico = document.getElementById('filtroMedico').value;
  const filtroDNI = document.getElementById('filtroDNI').value.trim();

  cargarReservas(filtroMedico, filtroDNI);
}

function init() {
  cargarMedicos();
  cargarReservas();

  // Configurar eventos de los filtros
  document
    .getElementById('filtroMedico')
    .addEventListener('change', aplicarFiltros);
  document
    .getElementById('filtroDNI')
    .addEventListener('input', aplicarFiltros);

  document
    .getElementById('btnGuardarReserva')
    .addEventListener('click', guardarCambiosReserva);
}

document.addEventListener('DOMContentLoaded', init);
