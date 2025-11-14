export async function users() {
  try {
    const token = sessionStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('https://dummyjson.com/users', {
      headers: headers,
    });

    if (response.ok) {
      const data = await response.json();
      const usuarios = data.users;
      return usuarios;
    } else {
      console.error(response.status);
      throw Error('Error al listar usuarios');
    }
  } catch (error) {
    console.error('error', error);
    alert('Error en la api Dummy');
  }
}

export async function getCurrentUser() {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      return null;
    }

    const response = await fetch('https://dummyjson.com/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al obtener información del usuario');
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const tablaUsuariosBody = document.querySelector('#tablaUsuarios tbody');
  if (!tablaUsuariosBody) {
    return;
  }

  const usuarios = await users();
  if (usuarios) {
    usuarios.forEach((element) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${element.firstName} ${element.lastName}</td>
        <td>${element.username}</td>
        <td>${element.email}</td>
        <td>${element.phone}</td>
        <td>${element.role || 'user'}</td>
      `;
      tablaUsuariosBody.appendChild(fila);
    });
  } else {
    console.error('Error: La función users() no devolvió datos.');
  }
});
