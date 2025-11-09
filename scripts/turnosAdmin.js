import { medicosIniciales } from '../config/medicos.js';
import { especialidadesIniciales } from '../config/especialidades.js';

// Inicializar datos si no existen
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

function cargarReservas(filtroMedicoId = '') {
  const tbody = document.querySelector('#tablaReservas tbody');
  tbody.innerHTML = '';

  let reservasFiltradas = reservas;

  if (filtroMedicoId) {
    reservasFiltradas = reservas.filter(
      (reserva) => parseInt(reserva.medicoId) === parseInt(filtroMedicoId)
    );
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

function editarReserva(reservaId) {
  const reserva = reservas.find((r) => r.id === parseInt(reservaId));
  if (!reserva) return;

  document.getElementById('reservaId').value = reserva.id;
  document.getElementById('editarDocumento').value = reserva.documento;
  document.getElementById('editarPaciente').value = reserva.apellidoNombre;
  document.getElementById('editarMedicoReserva').value = reserva.medicoId;
  document.getElementById('editarFechaReserva').value = reserva.fecha;
  document.getElementById('editarHoraReserva').value = reserva.hora;
  document.getElementById('editarEstado').checked = reserva.estado;

  const modal = new bootstrap.Modal(
    document.getElementById('modalEditarReserva')
  );
  modal.show();
}

function cambiarEstadoReserva(reservaId) {
  const reservaIndex = reservas.findIndex((r) => r.id === parseInt(reservaId));
  if (reservaIndex === -1) return;

  const nuevaEstado = !reservas[reservaIndex].estado;
  const accion = nuevaEstado ? 'activada' : 'cancelada';

  if (confirm(`¿Está seguro de que desea ${accion} esta reserva?`)) {
    reservas[reservaIndex].estado = nuevaEstado;
    localStorage.setItem('reservas', JSON.stringify(reservas));
    cargarReservas(document.getElementById('filtroMedico').value);
    alert(`Reserva ${accion} correctamente`);
  }
}

function guardarCambiosReserva() {
  const reservaId = parseInt(document.getElementById('reservaId').value);
  const documento = document.getElementById('editarDocumento').value;
  const paciente = document.getElementById('editarPaciente').value;
  const medicoId = parseInt(
    document.getElementById('editarMedicoReserva').value
  );
  const fecha = document.getElementById('editarFechaReserva').value;
  const hora = document.getElementById('editarHoraReserva').value;
  const estado = document.getElementById('editarEstado').checked;

  const reservaIndex = reservas.findIndex((r) => r.id === reservaId);
  if (reservaIndex !== -1) {
    reservas[reservaIndex] = {
      ...reservas[reservaIndex],
      documento: documento,
      apellidoNombre: paciente,
      medicoId: medicoId,
      medicoNombre:
        medicos.find((m) => m.id === medicoId)?.nombre_completo || '',
      fecha: fecha,
      hora: hora,
      estado: estado,
    };

    localStorage.setItem('reservas', JSON.stringify(reservas));

    const filtroActual = document.getElementById('filtroMedico').value;
    cargarReservas(filtroActual);

    const modal = bootstrap.Modal.getInstance(
      document.getElementById('modalEditarReserva')
    );
    modal.hide();

    alert('Reserva actualizada correctamente');
  }
}

function init() {
  cargarMedicos();
  cargarReservas();

  document.getElementById('filtroMedico').addEventListener('change', (e) => {
    cargarReservas(e.target.value);
  });

  document
    .getElementById('btnGuardarReserva')
    .addEventListener('click', guardarCambiosReserva);
}

document.addEventListener('DOMContentLoaded', init);
