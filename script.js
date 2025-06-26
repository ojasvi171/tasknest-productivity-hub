let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  
  let filtered = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.nav-btn:nth-child(${
    currentFilter === 'all' ? 1 : currentFilter === 'active' ? 2 : 3
  })`).classList.add('active');

  if (filtered.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <i class="fas fa-cloud"></i>
      <p>No tasks found. Add one to get started!</p>
    `;
    list.appendChild(emptyState);
  } else {
    filtered.forEach((task, index) => {
      const card = document.createElement("div");
      card.className = `task-card ${task.priority} ${task.completed ? 'completed' : ''}`;
      
      const info = document.createElement("div");
      info.className = "task-info";
      
      const title = document.createElement("div");
      title.className = "task-title";
      if (task.completed) title.style.textDecoration = "line-through";
      
      const icon = document.createElement("i");
      icon.className = task.priority === 'normal' ? 'far fa-star' : 
                      task.priority === 'important' ? 'fas fa-star' : 'fas fa-fire';
      
      title.appendChild(icon);
      title.appendChild(document.createTextNode(task.text));
      
      const date = document.createElement("div");
      date.className = "task-date";
      const dateIcon = document.createElement("i");
      dateIcon.className = "far fa-clock";
      date.appendChild(dateIcon);
      date.appendChild(document.createTextNode(formatDate(task.date)));
      
      info.appendChild(title);
      info.appendChild(date);
      
      const actions = document.createElement("div");
      actions.className = "task-actions";
      
      const completeBtn = document.createElement("button");
      completeBtn.className = "complete-btn";
      completeBtn.title = task.completed ? "Mark as incomplete" : "Complete task";
      const completeIcon = document.createElement("i");
      completeIcon.className = task.completed ? "fas fa-undo" : "fas fa-check";
      completeBtn.appendChild(completeIcon);
      completeBtn.onclick = () => toggleComplete(index);
      
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.title = "Delete task";
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fas fa-trash";
      deleteBtn.appendChild(deleteIcon);
      deleteBtn.onclick = () => deleteTask(index);
      
      actions.appendChild(completeBtn);
      actions.appendChild(deleteBtn);
      card.appendChild(info);
      card.appendChild(actions);
      list.appendChild(card);
    });
  }

  // Update counters
  document.getElementById("taskCount").textContent = `${filtered.length} ${filtered.length === 1 ? 'task' : 'tasks'}`;
  const completedCount = tasks.filter(t => t.completed).length;
  document.getElementById("completedCount").textContent = `${completedCount} completed`;
}

function formatDate(dateString) {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const date = document.getElementById("taskDate").value;
  const priority = document.getElementById("taskPriority").value;
  
  if (!text) {
    alert("Please enter a task description");
    return;
  }
  
  if (!date) {
    alert("Please select a date and time");
    return;
  }

  tasks.push({ 
    text, 
    date, 
    priority, 
    completed: false,
    createdAt: new Date().toISOString()
  });
  
  document.getElementById("taskInput").value = "";
  document.getElementById("taskDate").value = "";
  saveTasks();
  renderTasks();
  
  // Show success animation
  const addBtn = document.querySelector('.add-btn');
  addBtn.classList.add('success');
  setTimeout(() => addBtn.classList.remove('success'), 1000);
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  tasks[index].completedAt = tasks[index].completed ? new Date().toISOString() : null;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

function clearAll() {
  if (tasks.length === 0) {
    alert("There are no tasks to clear!");
    return;
  }
  
  if (confirm("Are you sure you want to clear ALL tasks? This cannot be undone.")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Theme toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  saveThemePreference();
});

function saveThemePreference() {
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("themePreference", isDark ? "dark" : "light");
}

function loadThemePreference() {
  const preference = localStorage.getItem("themePreference");
  if (preference === "dark") {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  }
}

// Initialize
loadThemePreference();
renderTasks();

// Add keyboard shortcut for adding tasks
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.target.id === 'taskInput' || e.target.id === 'taskDate')) {
    addTask();
  }
});

