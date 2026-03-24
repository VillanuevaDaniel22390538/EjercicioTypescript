const API_URL = 'http://localhost:3001/todos';

// Elementos del DOM
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const todoList = document.getElementById('todo-list');
const messageDiv = document.getElementById('message');
const filterButtons = document.querySelectorAll('.filters button');

// Estado de filtro actual
let currentFilter = 'all';

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    todoForm.addEventListener('submit', handleAddTodo);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.id.replace('filter-', '');
            loadTodos();
        });
    });
}

// Mostrar mensaje de estado
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 3000);
}

// Cargar y mostrar tareas
async function loadTodos() {
    try {
        todoList.innerHTML = '<li class="loading">Cargando tareas...</li>';
        
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar tareas');
        
        let todos = await response.json();
        
        // Aplicar filtro
        if (currentFilter === 'pending') {
            todos = todos.filter(todo => !todo.complete);
        } else if (currentFilter === 'complete') {
            todos = todos.filter(todo => todo.complete);
        }
        
        renderTodos(todos);
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al cargar las tareas. Verifica que la API esté corriendo.', 'error');
        todoList.innerHTML = '<li class="loading">Error al cargar</li>';
    }
}

// Renderizar lista de tareas
function renderTodos(todos) {
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="loading">No hay tareas para mostrar</li>';
        return;
    }
    
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.complete ? 'complete' : ''}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
            <input type="checkbox" ${todo.complete ? 'checked' : ''} class="toggle-complete">
            <span class="task-text">${escapeHtml(todo.task)}</span>
            <div class="actions">
                <button class="btn-complete toggle-complete">${todo.complete ? 'Desmarcar' : 'Completar'}</button>
                <button class="btn-delete">Eliminar</button>
            </div>
        `;
        
        // Event listeners para botones de la tarea
        li.querySelector('.toggle-complete').addEventListener('click', () => toggleComplete(todo.id, !todo.complete));
        li.querySelector('.btn-delete').addEventListener('click', () => deleteTodo(todo.id));
        
        todoList.appendChild(li);
    });
}

// Escape HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Agregar nueva tarea
async function handleAddTodo(e) {
    e.preventDefault();
    
    const task = taskInput.value.trim();
    if (!task) return;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: task,
                complete: false
            })
        });
        
        if (!response.ok) throw new Error('Error al agregar tarea');
        
        const newTodo = await response.json();
        showMessage('Tarea agregada exitosamente', 'success');
        taskInput.value = '';
        loadTodos();
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al agregar la tarea', 'error');
    }
}

// Marcar/Desmarcar tarea como completada
async function toggleComplete(id, complete) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ complete: complete })
        });
        
        if (!response.ok) throw new Error('Error al actualizar tarea');
        
        showMessage(`Tarea ${complete ? 'completada' : 'desmarcada'}`, 'success');
        loadTodos();
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al actualizar la tarea', 'error');
    }
}

// Eliminar tarea
async function deleteTodo(id) {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar tarea');
        
        showMessage('Tarea eliminada exitosamente', 'success');
        loadTodos();
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al eliminar la tarea', 'error');
    }
}