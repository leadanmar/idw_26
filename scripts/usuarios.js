export async function users() {
  try {
    const response = await fetch('https://dummyjson.com/users');
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

document.addEventListener('DOMContentLoaded', async () => {
  const tablalkuariosBody = document.querySelector('#tablaUsuarios tbody');
  const usuarios = await users();
  if (usuarios) {
    usuarios.forEach((element) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
                    <td>${element.firstName}</td>
                    <td>${element.username}</td>
                    <td>${element.email}</td>
                    <td>${element.phone}</td>
                `;
      tablalkuariosBody.appendChild(fila);
    });
  } else {
    console.error(response.status);
    throw Error('Error al listar usuarios');
  }
});
