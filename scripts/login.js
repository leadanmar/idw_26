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

formLogin.addEventListener('submit', function (event) {
  event.preventDefault();

  let usuarioInput = usuario.value.trim();
  let claveInput = clave.value.trim();

  const isUsuario = usuarios.find(
    (u) => u.usuario === usuarioInput && u.clave === claveInput
  );

  const isAdmin = usuarios.find(
    (u) =>
      u.usuario === usuarioInput &&
      u.clave === claveInput &&
      u.permiso === 'admin'
  );
  console.log(isAdmin);

  if (isAdmin) {
    sessionStorage.setItem('usuarioLogueado', usuarioInput);
    sessionStorage.setItem('permiso', 'admin');
    window.location.href = 'index.html';
  } else if (isUsuario) {
    sessionStorage.setItem('usuarioLogueado', usuarioInput);
    sessionStorage.setItem('permiso', 'user');
    window.location.href = 'index.html';
  } else {
    mostrarMensaje('Error en credenciales', 'danger');
  }
});
