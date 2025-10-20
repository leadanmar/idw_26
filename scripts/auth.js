document.addEventListener('DOMContentLoaded', function () {
  const usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
  const usuarioPermiso = sessionStorage.getItem('permiso');

  const elementosPrivados = document.querySelectorAll('.solo-logueado');
  const elementosAdmin = document.querySelectorAll('.solo-admin');
  const elementosPublicos = document.querySelectorAll('.solo-publico');

  if (usuarioLogueado) {
    elementosPrivados.forEach((el) => (el.style.display = 'block'));
    elementosPublicos.forEach((el) => (el.style.display = 'none'));

    const nombreUsuario = document.getElementById('nombreUsuario');
    if (nombreUsuario) {
      nombreUsuario.textContent = usuarioLogueado;
    }
  } else {
    elementosPrivados.forEach((el) => (el.style.display = 'none'));
    elementosPublicos.forEach((el) => (el.style.display = 'block'));
  }

  if (usuarioPermiso === 'admin') {
    elementosAdmin.forEach((el) => (el.style.display = 'block'));
  } else {
    elementosAdmin.forEach((el) => (el.style.display = 'none'));
  }
});

function actualizarNavbar() {
  const usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
  const botonNavbar = document.querySelector('.navbar-text');
  const welcomeUser = document.getElementById('welcomeUser');

  if (usuarioLogueado) {
    botonNavbar.innerHTML = `
    <a href="login.html" class="buttonNav" style="color: white" onclick="cerrarSesion()"
      >Salir</a
    >
    `;
    welcomeUser.innerHTML = `
    <span style="color: white">${usuarioLogueado}</span>
    `;
  } else {
    botonNavbar.innerHTML = `
      <a href="login.html" class="buttonNav" style="color: white">Entrar</a>
    `;
  }
}

function cerrarSesion() {
  sessionStorage.removeItem('usuarioLogueado');
  sessionStorage.removeItem('permiso');
  window.location.href = 'index.html';
}

actualizarNavbar();
