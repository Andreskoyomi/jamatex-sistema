//const API_URL = 'http://localhost:3000/usuarios';
const API_URL = '/usuarios';
const userList = document.getElementById('user-list');
const userForm = document.getElementById('userForm');
const userModal = document.getElementById('userModal');
const searchInput = document.getElementById('search');

let usuariosGlobal = []; //Se crea variable global

// 1. Cargar usuarios al iniciar
document.addEventListener('DOMContentLoaded', getUsuarios);

async function getUsuarios() {
    try {
        const res = await fetch(API_URL);
        const usuarios = await res.json();
        usuariosGlobal = usuarios;
        renderTable(usuariosGlobal);
        actualizarCards(usuariosGlobal);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }
}

// 2. Dibujar la tabla dinámicamente
function renderTable(usuarios) {
    userList.innerHTML = '';
    usuarios.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.nombre}</td>
            <td>${user.correo}</td>
            <td><span class="badge-rol">${user.rol}</span></td>
            <td><span class="status ${user.estado ? 'active' : 'inactive'}">
                ${user.estado ? 'Activo' : 'Inactivo'}
            </span></td>
            <td>
                <button onclick="editUser(${user.id_usuario})" class="btn-edit"><i class="fas fa-edit"></i></button>
                <button onclick="deleteUser(${user.id_usuario})" class="btn-delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        userList.appendChild(tr);
    });
}

// 3. Crear o Actualizar Usuario
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('userId').value;
    const userData = {
        nombre: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        contrasena: document.getElementById('contrasena').value,
        rol: document.getElementById('rol').value,
        estado: parseInt(document.getElementById('estado').value)
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    cerrarModal();
    getUsuarios();
    userForm.reset();
});

// 4. Eliminar Usuario
async function deleteUser(id) {
    if (confirm('¿Estás seguro de eliminar este usuario de Jamatex?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        getUsuarios();
    }
}

// 5. Funciones de la Interfaz (Modal y Cards)
function mostrarModal() { 
    userModal.style.display = 'flex'; 
    document.getElementById('modalTitle').innerText = "Nuevo Usuario";
    document.getElementById('userId').value = "";
}

function cerrarModal() { userModal.style.display = 'none'; }

function actualizarCards(usuarios) {
    document.getElementById('total-count').innerText = usuarios.length;
    document.getElementById('active-count').innerText = usuarios.filter(u => u.estado == 1).length;
    document.getElementById('inactive-count').innerText = usuarios.filter(u => u.estado == 0).length;
}

// Función para cargar datos en el modal y editar
async function editUser(id) {
    const res = await fetch(API_URL);
    const usuarios = await res.json();
    const user = usuarios.find(u => u.id_usuario === id);
    
    document.getElementById('userId').value = user.id_usuario;
    document.getElementById('nombre').value = user.nombre;
    document.getElementById('correo').value = user.correo;
    document.getElementById('rol').value = user.rol;
    document.getElementById('estado').value = user.estado;
    
    document.getElementById('modalTitle').innerText = "Editar Usuario";
    userModal.style.display = 'flex';
}

searchInput.addEventListener('input', () => {
    const texto = searchInput.value.toLowerCase();
    const usuariosFiltrados = usuariosGlobal.filter(usuario =>
        usuario.nombre.toLowerCase().includes(texto) ||
        usuario.correo.toLowerCase().includes(texto) ||
        usuario.rol.toLowerCase().includes(texto)
    );

    renderTable(usuariosFiltrados);
    actualizarCards(usuariosFiltrados);
});