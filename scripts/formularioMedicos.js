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

export let imagenBase64 = '';

export function inicializarInputImagen() {
  const inputImagen = document.getElementById('inputImagen');
  const preview = document.getElementById('preview');

  preview.style.display = 'none';
  inputImagen.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagenBase64 = e.target.result;
        preview.src = imagenBase64;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      imagenBase64 = '';
      preview.src = '';
      preview.style.display = 'none';
    }
  });
}

export function generarSelectEspecialidades() {
  const select = document.getElementById('especialidad');
  if (!select) return;

  select.innerHTML = '<option value="">Seleccione una especialidad</option>';
  especialidades.forEach((especialidad) => {
    const option = document.createElement('option');
    option.value = especialidad.id;
    option.textContent = especialidad.nombre;
    select.appendChild(option);
  });
}

export function generarObrasSociales() {
  const container = document.getElementById('obrasSocialesContainer');
  if (!container) return;

  container.innerHTML = '';
  obrasSociales.forEach((obra) => {
    container.innerHTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${obra.id}" id="obra${obra.id}">
                <label class="form-check-label" for="obra${obra.id}">${obra.nombre}</label>
            </div>
        `;
  });
}

export function obtenerObrasSeleccionadas() {
  const checkboxes = document.querySelectorAll(
    '#obrasSocialesContainer input:checked'
  );
  return Array.from(checkboxes).map((checkbox) => parseInt(checkbox.value));
}
