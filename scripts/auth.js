document.addEventListener('DOMContentLoaded', function () {
  const usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
  const usuarioPermiso = sessionStorage.getItem('permiso');

  const elementosAdmin = document.querySelectorAll('.solo-admin');

  if (usuarioPermiso === 'admin') {
    elementosAdmin.forEach((el) => (el.style.display = 'block'));
  } else {
    elementosAdmin.forEach((el) => (el.style.display = 'none'));
  }
});

function actualizarNavbar() {
  const usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
  const usuarioPermiso = sessionStorage.getItem('permiso');
  const botonNavbar = document.querySelector('.navbar-text');
  const welcomeUser = document.getElementById('welcomeUser');

  if (botonNavbar) botonNavbar.innerHTML = '';
  if (welcomeUser) welcomeUser.innerHTML = '';

  if (usuarioLogueado) {
    const salirLink = document.createElement('a');
    salirLink.href = '#';
    salirLink.className = 'buttonNav';
    salirLink.style.color = 'white';
    salirLink.textContent = 'Salir';
    salirLink.addEventListener('click', function (e) {
      e.preventDefault();
      cerrarSesion();
    });
    if (botonNavbar) botonNavbar.appendChild(salirLink);
    let welcomeHTML = '';

    if (usuarioPermiso === 'admin') {
      welcomeHTML = `
        <span class="navbar-text text-white fw-bold me-lg-3 mb-2 mb-lg-0">
          ${usuarioLogueado}
        </span>
      `;
    } else {
      welcomeHTML = `
        <div class="dropdown me-lg-3 mb-2 mb-lg-0">
          <button 
            class="buttonNav dropdown-toggle" 
            style="color: white; background-color: transparent; border: none;"
            type="button" 
            id="dropdownUserMenu" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            ${usuarioLogueado}
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUserMenu">
            <li>
              <a class="dropdown-item" href="misTurnos.html">Mis Turnos</a>
            </li>
          </ul>
        </div>
      `;
    }

    if (welcomeUser) welcomeUser.innerHTML = welcomeHTML;
  } else {
    if (botonNavbar) {
      botonNavbar.innerHTML = `
        <a href="login.html" class="buttonNav" style="color: white">Entrar</a>
      `;
    }
  }
}

function cerrarSesion() {
  sessionStorage.removeItem('usuarioLogueado');
  sessionStorage.removeItem('permiso');
  sessionStorage.removeItem('token');
  window.location.href = 'index.html';
}

actualizarNavbar();

export async function login(userParam, passParam) {
  try {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userParam,
        password: passParam,
      }),
    });

    if (!response.ok) {
      console.error('Error al autenticar');
      return false;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
