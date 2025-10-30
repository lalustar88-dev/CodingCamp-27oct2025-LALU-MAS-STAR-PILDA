// Data storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add event listeners
    document.getElementById('addBtn').addEventListener('click', addTodo);
    document.getElementById('filterBtn').addEventListener('click', openFilter);
    document.getElementById('deleteAllBtn').addEventListener('click', deleteAll);
    document.getElementById('applyFilterBtn').addEventListener('click', applyFilter);
    document.getElementById('cancelFilterBtn').addEventListener('click', closeFilter);
    
    // Enter key support for task input
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Event delegation for dynamically created buttons
    document.getElementById('tableBody').addEventListener('click', function(e) {
        if (e.target.classList.contains('complete-btn')) {
            const id = e.target.getAttribute('data-id');
            completeTask(id);
        }
        
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            deleteTask(id);
        }
    });
    
    renderTasks();
}

// Add new task
function addTodo() {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    
    const taskText = taskInput.value.trim();
    const dateValue = dateInput.value;
    
    if (taskText === '' || dateValue === '') {
        alert('Please fill in both task and date!');
        return;
    }
    
    // Format date as mm/dd/yyyy
    const date = new Date(dateValue);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    
    // Create new task object
    const newTask = {
        id: Date.now().toString(),
        task: taskText,
        date: formattedDate,
        status: 'PENDING'
    };
    
    tasks.push(newTask);
    saveToLocalStorage();
    renderTasks();
    
    // Clear inputs
    taskInput.value = '';
    dateInput.value = '';
    taskInput.focus();
}

// Render tasks to table
function renderTasks() {
    const tableBody = document.getElementById('tableBody');
    const noTask = document.getElementById('noTask');
    
    tableBody.innerHTML = '';
    
    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => task.status === 'PENDING');
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.status === 'COMPLETED');
    }
    
    if (filteredTasks.length === 0) {
        noTask.style.display = 'block';
        tableBody.style.display = 'none';
    } else {
        noTask.style.display = 'none';
        tableBody.style.display = 'block';
        
        filteredTasks.forEach(task => {
            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <div>${task.task}</div>
                <div>${task.date}</div>
                <div class="status-${task.status.toLowerCase()}">${task.status}</div>
                <div class="actions">
                    <button class="complete-btn" data-id="${task.id}">Complete</button>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </div>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Complete task
function completeTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, status: 'COMPLETED' };
        }
        return task;
    });
    saveToLocalStorage();
    renderTasks();
}

// Delete individual task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveToLocalStorage();
        renderTasks();
    }
}

// Delete all tasks
function deleteAll() {
    if (tasks.length === 0) {
        alert('No tasks to delete!');
        return;
    }
    
    if (confirm('Are you sure you want to delete ALL tasks? This action cannot be undone.')) {
        tasks = [];
        saveToLocalStorage();
        renderTasks();
    }
}

// Filter functions
function openFilter() {
    document.getElementById('filterModal').style.display = 'flex';
}

function closeFilter() {
    document.getElementById('filterModal').style.display = 'none';
}

function applyFilter() {
    const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
    currentFilter = selectedFilter;
    closeFilter();
    renderTasks();
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}