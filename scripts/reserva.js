import { obrasSocialesIniciales } from "../config/obrasSociales.js";
import { especialidadesIniciales } from "../config/especialidades.js";
import { medicosIniciales } from "../config/medicos.js";

if (!localStorage.getItem("especialidades")) {
  localStorage.setItem(
    "especialidades",
    JSON.stringify(especialidadesIniciales)
  );
}

if (!localStorage.getItem("obrasSociales")) {
  localStorage.setItem("obrasSociales", JSON.stringify(obrasSocialesIniciales));
}

if (!localStorage.getItem("medicos")) {
  localStorage.setItem("medicos", JSON.stringify(medicosIniciales));
}

if (!localStorage.getItem("reservas")) {
  localStorage.setItem("reservas", JSON.stringify([]));
}

let obrasSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];
let especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];
let medicos = JSON.parse(localStorage.getItem("medicos")) || [];
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

function mostrarResumenReserva(datos) {
  const medico = medicos.find((m) => m.id === parseInt(datos.medicoId));
  const especialidad = especialidades.find(
    (e) => e.id === medico.especialidad_id
  );
  const obraSocial =
    datos.obraSocialId === "ninguna"
      ? { nombre: "Ninguna" }
      : obrasSociales.find((os) => os.id === parseInt(datos.obraSocialId));

  const precioBase = medico.precioBase || 5000;
  const descuento =
    datos.obraSocialId === "ninguna" ? 0 : obraSocial.descuentoConsulta || 0;
  const valorFinal = Math.round(precioBase * (1 - descuento / 100));

  document.getElementById("detallesReserva").innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <h6>Datos del Paciente:</h6>
        <p><strong>Documento:</strong> ${datos.documento}</p>
        <p><strong>Apellido y Nombre:</strong> ${datos.apellidoNombre}</p>
        <p><strong>Obra Social:</strong> ${obraSocial.nombre}</p>
      </div>
      <div class="col-md-6">
        <h6>Detalles del Turno:</h6>
        <p><strong>Médico:</strong> ${medico.nombre_completo}</p>
        <p><strong>Especialidad:</strong> ${
          especialidad.nombre || "Ninguna"
        }</p>
        <p><strong>Fecha:</strong> ${datos.fecha}</p>
        <p><strong>Hora:</strong> ${datos.hora}</p>
      </div>
    </div>
    <hr>
    <div class="alert ${
      datos.obraSocialId === "ninguna" ? "alert-warning" : "alert-success"
    }">
      <h6>Valor de la Consulta:</h6>
      <p><strong>Precio Base:</strong> $${precioBase}</p>
      <p><strong>Descuento:</strong> ${descuento}%</p>
      <p><strong>Valor Final:</strong> <span class="fw-bold">$${valorFinal}</span></p>
    </div>
  `;

  document.getElementById("resumenReserva").style.display = "block";
  document
    .getElementById("resumenReserva")
    .scrollIntoView({ behavior: "smooth" });
}

function guardarReserva(datos) {
  const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");
  const medico = medicos.find((m) => m.id === parseInt(datos.medicoId));
  const obraSocial =
    datos.obraSocialId === "ninguna"
      ? { nombre: "Ninguna" }
      : obrasSociales.find((os) => os.id === parseInt(datos.obraSocialId));
  const precioBase = medico.precioBase || 5000;

  const descuento =
    datos.obraSocialId === "ninguna" ? 0 : obraSocial.descuentoConsulta || 0;
  const valorFinal = Math.round(precioBase * (1 - descuento / 100));

  let obraSocialId = null;

  if (datos.obraSocialId !== "ninguna") {
    const obraSocial = obrasSociales.find(
      (os) => os.id === parseInt(datos.obraSocialId)
    );
    obraSocialId = datos.obraSocialId;
  }

  const nuevaReserva = {
    id: Date.now(),
    documento: datos.documento,
    apellidoNombre: datos.apellidoNombre,
    obraSocialId: obraSocialId,
    medicoId: datos.medicoId,
    medicoNombre: medico.nombre_completo,
    especialidadId: medico.especialidad_id,
    fecha: datos.fecha,
    hora: datos.hora,
    valorConsulta: valorFinal,
    fechaReserva: new Date().toISOString(),
    estado: true,
    usuario: usuarioLogueado || null,
  };

  reservas.push(nuevaReserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  return nuevaReserva;
}

function configurarFormulario() {
  const formulario = document.getElementById("reservaTurnoForm");
  const btnConfirmar = document.getElementById("confirmarReserva");
  const btnCancelar = document.getElementById("cancelarReserva");

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const datos = {
      documento: document.getElementById("documento").value.trim(),
      apellidoNombre: document.getElementById("apellidoNombre").value.trim(),
      obraSocialId: document.getElementById("obraSocial").value,
      medicoId: document.getElementById("medico").value,
      fecha: document.getElementById("fecha").value,
      hora: document.getElementById("hora").value,
    };
    document.querySelector('button[type="submit"]').style.display = "none";
    mostrarResumenReserva(datos);

    mostrarResumenReserva(datos);
  });

  btnConfirmar.addEventListener("click", function () {
    const datos = {
      documento: document.getElementById("documento").value.trim(),
      apellidoNombre: document.getElementById("apellidoNombre").value.trim(),
      obraSocialId: document.getElementById("obraSocial").value,
      medicoId: document.getElementById("medico").value,
      fecha: document.getElementById("fecha").value,
      hora: document.getElementById("hora").value,
    };

    const reservaGuardada = guardarReserva(datos);

    alert(
      `✅ Turno reservado exitosamente!\n\nCódigo de reserva: ${reservaGuardada.id}\nValor: $${reservaGuardada.valorConsulta}`
    );

    formulario.reset();
    document.getElementById("resumenReserva").style.display = "none";
    document.querySelector('button[type="submit"]').style.display =
      "inline-block";
  });

  btnCancelar.addEventListener("click", function () {
    formulario.reset();
    document.getElementById("resumenReserva").style.display = "none";
    document.querySelector('button[type="submit"]').style.display =
      "inline-block";
  });
}

function init() {
  configurarFormulario();
}

document.addEventListener("DOMContentLoaded", init);
