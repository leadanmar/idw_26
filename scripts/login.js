import { login } from './auth.js';
import { users } from './usuarios.js';

const formLogin = document.getElementById('formLogin');
const usuario = document.getElementById('username');
const clave = document.getElementById('password');
const mensaje = document.getElementById('mensaje');

function mostrarMensaje(texto, tipo) {
  mensaje.innerHTML = `
    <div >
      <div class="text-center alert alert-${tipo}">${texto}</div>
    </div>
  `;
}

visible.addEventListener('change', function () {
  if (this.checked) {
    clave.type = 'text';
  } else {
    clave.type = 'password';
  }
});

formLogin.addEventListener('submit', async function (event) {
  event.preventDefault();

  let usuarioInput = usuario.value.trim();
  let claveInput = clave.value.trim();
  const isUsuario = await login(usuarioInput, claveInput);
  console.log(isUsuario);

  const usuarios = await users();

  const isAdmin = usuarios.find(
    (u) => u.username === usuarioInput && u.role === 'admin'
  );

  if (isUsuario) {
    sessionStorage.setItem('usuarioLogueado', isUsuario.username);
    sessionStorage.setItem('token', isUsuario.accessToken);
    if (isAdmin) {
      sessionStorage.setItem('permiso', 'admin');
    } else {
      sessionStorage.setItem('permiso', 'user');
    }
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 100);
  } else {
    mostrarMensaje('Error en credenciales', 'danger');
  }
});
