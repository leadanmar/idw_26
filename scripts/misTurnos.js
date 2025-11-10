const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");
if (!usuarioLogueado) {
  alert("Debes iniciar sesión para ver tus turnos.");
  window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", () => {
  const todasLasReservas = JSON.parse(localStorage.getItem("reservas")) || [];
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  const especialidades =
    JSON.parse(localStorage.getItem("especialidades")) || [];

  const misReservas = todasLasReservas.filter(
    (reserva) => reserva.usuario === usuarioLogueado
  );

  const tablaBody = document.querySelector("#tablaMisReservas tbody");
  function getEspecialidadNombre(id) {
    const esp = especialidades.find((e) => e.id === id);
    return esp ? esp.nombre : "No encontrada";
  }

  function getMedicoNombre(id) {
    const med = medicos.find((m) => m.id === id);
    return med ? med.nombre_completo : "No encontrado";
  }

  function renderizarMisReservas() {
    tablaBody.innerHTML = "";
    if (misReservas.length === 0) {
      tablaBody.innerHTML =
        '<tr><td colspan="7" class="text-center">No tienes turnos reservados.</td></tr>';
      return;
    }

    misReservas.forEach((reserva) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${reserva.medicoNombre || getMedicoNombre(reserva.medicoId)}</td>
        <td>${getEspecialidadNombre(reserva.especialidadId)}</td>
        <td>${reserva.fecha}</td>
        <td>${reserva.hora}</td>
        <td>$${reserva.valorConsulta}</td>
        <td>
          <span class="badge ${reserva.estado ? "bg-success" : "bg-danger"}">
            ${reserva.estado ? "Activo" : "Cancelado"}
          </span>
        </td>
        <td>
          ${
            reserva.estado
              ? `<button class="btn btn-danger btn-sm" data-id="${reserva.id}">Cancelar</button>`
              : ""
          }
        </td>
      `;

      if (reserva.estado) {
        tr.querySelector("button.btn-danger").addEventListener("click", (e) => {
          const idCancelar = e.target.getAttribute("data-id");
          cancelarReserva(parseInt(idCancelar));
        });
      }

      tablaBody.appendChild(tr);
    });
  }

  function cancelarReserva(id) {
    if (
      !confirm(
        "¿Estás seguro de que quieres cancelar este turno? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    const todasLasReservasActualizadas = todasLasReservas.map((reserva) => {
      if (reserva.id === id) {
        return { ...reserva, estado: false };
      }
      return reserva;
    });

    localStorage.setItem(
      "reservas",
      JSON.stringify(todasLasReservasActualizadas)
    );

    window.location.reload();
  }

  renderizarMisReservas();
});
