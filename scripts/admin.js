function verificarAutenticacion() {
  const usuarioPermiso = sessionStorage.getItem('permiso');

  if (usuarioPermiso !== 'admin') {
    alert('Debes iniciar sesión como administrador para acceder a esta página');
    window.location.href = 'login.html';
  }
}

verificarAutenticacion();
