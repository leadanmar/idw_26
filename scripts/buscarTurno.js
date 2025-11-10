document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formBuscarTurno");
  const dniInput = document.getElementById("dniInput");
  const tablaBody = document.querySelector("#tablaResultadosBusqueda tbody");

  const todasLasReservas = JSON.parse(localStorage.getItem("reservas")) || [];
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  const especialidades =
    JSON.parse(localStorage.getItem("especialidades")) || [];

  function getEspecialidadNombre(id) {
    const esp = especialidades.find((e) => e.id === id);
    return esp ? esp.nombre : "No encontrada";
  }

  function getMedicoNombre(id) {
    const med = medicos.find((m) => m.id === id);
    return med ? med.nombre_completo : "No encontrado";
  }

  function renderizarResultados(resultados) {
    tablaBody.innerHTML = "";

    if (resultados.length === 0) {
      tablaBody.innerHTML =
        '<tr><td colspan="5" class="text-center text-danger">No se encontraron turnos activos para ese DNI.</td></tr>';
      return;
    }

    resultados.forEach((reserva) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${
              reserva.medicoNombre || getMedicoNombre(reserva.medicoId)
            }</td>
            <td>${getEspecialidadNombre(reserva.especialidadId)}</td>
            <td>${reserva.fecha}</td>
            <td>${reserva.hora}</td>
            <td>
                <span class="badge ${
                  reserva.estado ? "bg-success" : "bg-danger"
                }">
                    ${reserva.estado ? "Activo" : "Cancelado"}
                </span>
            </td>
        `;
      tablaBody.appendChild(tr);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitamos que la página se recargue

    const dniBuscado = dniInput.value.trim();

    if (!dniBuscado) {
      alert("Por favor, ingrese un DNI.");
      return;
    }

    const resultados = todasLasReservas.filter((reserva) => {
      return reserva.documento === dniBuscado && reserva.estado === true;
    });

    renderizarResultados(resultados);
  });
});
