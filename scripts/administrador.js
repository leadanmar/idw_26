// ==========================================================
// 1. VARIABLES GLOBALES
// ==========================================================
let medicos = JSON.parse(sessionStorage.getItem('medicos')) || []; 
let nextId = medicos.length > 0 ? Math.max(...medicos.map(m => m.id)) + 1 : 1;
let modoEdicion = false;

// Variables del DOM (Declaradas para ser asignadas en DOMContentLoaded)
let formAltaMedico, tablaBody, medicoIdInput, submitBtn, cancelarBtn;
let inputNombre, inputEspecialidad, inputObraSocial, inputTelefono, inputEmail; 

// ==========================================================
// 2. FUNCIONES CRUD
// ==========================================================

function renderizarMedicos() {
    if (!tablaBody) return; 
    
    tablaBody.innerHTML = ''; 

    medicos.forEach(medico => {
        const fila = tablaBody.insertRow();
        
        fila.insertCell().textContent = medico.id;
        fila.insertCell().textContent = medico.nombre_completo;
        fila.insertCell().textContent = medico.especialidad;
        fila.insertCell().textContent = medico.obra_social;
        fila.insertCell().textContent = medico.telefono;
        fila.insertCell().textContent = medico.email;

        const celdaAcciones = fila.insertCell();
        
        const btnModificar = document.createElement('button');
        btnModificar.textContent = 'Modificar';
        btnModificar.className = 'btn btn-sm btn-warning me-2';
        btnModificar.onclick = () => cargarMedicoParaEdicion(medico.id); 
        celdaAcciones.appendChild(btnModificar);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn btn-sm btn-danger';
        btnEliminar.onclick = () => eliminarMedico(medico.id); 
        celdaAcciones.appendChild(btnEliminar);
    });
}

function altaMedicos(event) {
    event.preventDefault(); 
    
    // Obtener valores usando las variables de referencia
    let nombre_completo = inputNombre.value.trim();
    let especialidad = inputEspecialidad.value.trim();
    let obra_social = inputObraSocial.value.trim();
    let telefono = inputTelefono.value.trim();
    let email = inputEmail.value.trim();

    if (!nombre_completo || !especialidad || !obra_social) {
        alert("Complete los campos requeridos (Nombre, Especialidad, Obra Social)");
        return;
    }
    
    const datosMedico = { nombre_completo, especialidad, obra_social, telefono, email };

    if (modoEdicion) {
        // LÓGICA DE ACTUALIZACIÓN (UPDATE): Ahora debería funcionar correctamente.
        const idAActualizar = parseInt(medicoIdInput.value);
        const indice = medicos.findIndex(m => m.id === idAActualizar);
        
        if (indice !== -1) {
            medicos[indice] = { id: idAActualizar, ...datosMedico }; // Se actualiza el objeto
            alert(`Médico ID ${idAActualizar} modificado.`);
            guardarYRenderizar();
            restablecerFormulario();
        }
        restablecerFormulario(); 
    } else {
        // LÓGICA DE CREACIÓN
        const nuevoMedico = { id: nextId++, ...datosMedico };
        medicos.push(nuevoMedico);
        alert(`Médico ${nombre_completo} registrado.`);
        guardarYRenderizar();
        formAltaMedico.reset();
    }
}

function cargarMedicoParaEdicion(id) { 
    const medico = medicos.find(m => m.id === id);
    if (medico) {
        // Rellenar campos usando las variables de referencia (inputNombre, etc.)
        inputNombre.value = medico.nombre_completo;
        inputEspecialidad.value = medico.especialidad;
        inputObraSocial.value = medico.obra_social;
        inputTelefono.value = medico.telefono;
        inputEmail.value = medico.email;
        
        medicoIdInput.value = medico.id; // Guarda el ID para saber qué actualizar
        modoEdicion = true;
        submitBtn.textContent = 'Guardar Cambios';
        cancelarBtn.style.display = 'inline-block'; 
    }
}

function restablecerFormulario() {
    formAltaMedico.reset();
    medicoIdInput.value = '';
    modoEdicion = false;
    submitBtn.textContent = 'Registrar Medico';
    cancelarBtn.style.display = 'none';
}

function eliminarMedico(id) {
    if (confirm(`¿Estás seguro de que quieres eliminar al médico con ID ${id}?`)) {
        medicos = medicos.filter(medico => medico.id !== id);
        alert('Médico eliminado.');
        
        if (parseInt(medicoIdInput.value) === id) {
            restablecerFormulario();
        }

        guardarYRenderizar();
    }
}

function guardarYRenderizar() {
    // Guarda los datos en sessionStorage
    sessionStorage.setItem('medicos', JSON.stringify(medicos)); 
    renderizarMedicos();
}

// ==========================================================
// 3. INICIALIZACIÓN (Protegida en DOMContentLoaded)
// ==========================================================
document.addEventListener('DOMContentLoaded', function() {
    // 1. ASIGNAR REFERENCIAS DEL DOM (Ahora es seguro)
    formAltaMedico = document.getElementById("altaMedicoForm");
    tablaBody = document.querySelector('#tablaMedicos tbody');
    medicoIdInput = document.getElementById('medicoId');
    submitBtn = document.getElementById('submitBtn');
    cancelarBtn = document.getElementById('cancelarBtn');
    
    // ASIGNACIÓN DE LOS INPUTS DEL FORMULARIO
    inputNombre = document.getElementById("nombre_completo");
    inputEspecialidad = document.getElementById("especialidad");
    inputObraSocial = document.getElementById("obra_social");
    inputTelefono = document.getElementById("telefono");
    inputEmail = document.getElementById("email");
    
    // 2. ASIGNAR EVENT LISTENERS (Ahora es seguro)
    if (formAltaMedico) formAltaMedico.addEventListener('submit', altaMedicos);
    if (cancelarBtn) cancelarBtn.addEventListener('click', restablecerFormulario);

    // 3. CARGAR DATOS (Lectura/Read)
    renderizarMedicos();
});

