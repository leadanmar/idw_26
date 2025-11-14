import { login } from './auth.js';

const formLogin = document.getElementById('formLogin');
const usuario = document.getElementById('username');
const clave = document.getElementById('password');
const mensaje = document.getElementById('mensaje');

function mostrarMensaje(texto, tipo) {
  mensaje.innerHTML = `
    <div>
      <div class="text-center alert alert-${tipo}">${texto}</div>
    </div>
  `;
}

const visible = document.getElementById('visible');
if (visible) {
  visible.addEventListener('change', function () {
    if (this.checked) {
      clave.type = 'text';
    } else {
      clave.type = 'password';
    }
  });
}

async function verificarAdmin(accessToken) {
  try {
    const response = await fetch('https://dummyjson.com/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return userData.role === 'admin' || userData.role === 'administrator';
    }
    return false;
  } catch (error) {
    console.error('Error al verificar admin:', error);
    return false;
  }
}

formLogin.addEventListener('submit', async function (event) {
  event.preventDefault();

  let usuarioInput = usuario.value.trim();
  let claveInput = clave.value.trim();

  try {
    const isUsuario = await login(usuarioInput, claveInput);

    if (isUsuario && isUsuario.accessToken) {
      sessionStorage.setItem('usuarioLogueado', isUsuario.username);
      sessionStorage.setItem('token', isUsuario.accessToken);

      const esAdmin = await verificarAdmin(isUsuario.accessToken);

      if (esAdmin) {
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
  } catch (error) {
    console.error('Error en login:', error);
    mostrarMensaje('Error al iniciar sesión', 'danger');
  }
});
