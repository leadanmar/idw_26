const formAltaMedico = document.getElementById("altaMedicoForm");
const inputNombre = document.getElementById("nombre_completo");
const inputEspecialidad = document.getElementById("especialidad");
const inputTelefono = document.getElementById("telefono");
const inputObra_social = document.getElementById("obra_social");
const inputEmail = document.getElementById("email");

function altaMedicos(event){
    event.preventDefaut();

    let nombre_completo = inputNombre.value.trin();
    let especialidad = inputEspecialidad.value.trin();
    let obra_social = inputObra_social.value.trin();
    let telefono = inputTelefono.value.trin();
    let email = inputEmail.value.trin();

    if (!nombre || !especialidad || !obra_social){
        alert("complete los campos requeridos");
        return;
    }
    alert(
        `Medico registrado:\n\n` +
        `Nombre: ${nombre_completo}` +
        `Especialidad: ${especialidad}` +
        `Obra Social: ${obra_social}` +
        `telefono: ${telefono}` +
        `email: ${email}`
    );

    formAltaMedico.reset();
}
formAltaMedico.addEventListener('submit', altaMedicos)