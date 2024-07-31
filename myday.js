document.addEventListener('DOMContentLoaded', (event) => {
    const plusButton = document.querySelector('.plus-button');
    const modal = document.getElementById('task-modal');
    const closeBtn = document.querySelector('.close-btn');
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Check if the day has changed and clear tasks if necessary
    function checkAndClearTasks() {
        const lastUpdateDate = localStorage.getItem('lastUpdateDate');
        const todayDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        if (lastUpdateDate !== todayDate) {
            // Clear tasks and update the last update date
            localStorage.removeItem('tasks');
            localStorage.setItem('lastUpdateDate', todayDate);
        }
    }

    // Open the modal
    plusButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close the modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskName = document.getElementById('task-name').value;
        const dueTime = document.getElementById('due-time').value;

        // Create a new list item
        const listItem = document.createElement('li');

        // Create a checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        // Create a label for the task name
        const label = document.createElement('label');
        label.textContent = `${taskName} - ${dueTime}`;

        // Create a star icon
        const starIcon = document.createElement('i');
        starIcon.className = 'fas fa-star star-icon';
        starIcon.style.color = ''; // Default color

        // Create a delete icon
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash delete-icon';

        // Add event listener to toggle the star color
        starIcon.addEventListener('click', () => {
            if (starIcon.style.color === 'yellow') {
                starIcon.style.color = ''; // Remove yellow
                removeStarredTask(taskName, dueTime);
            } else {
                starIcon.style.color = 'yellow'; // Set to yellow
                addStarredTask(taskName, dueTime);
            }
            saveTasksToLocalStorage();
            updateImportantTasksPage();
        });

        // Add event listener to delete the task
        deleteIcon.addEventListener('click', () => {
            listItem.remove();
            saveTasksToLocalStorage();
            updateImportantTasksPage();
        });

        // Append checkbox, label, star icon, and delete icon to the list item
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        listItem.appendChild(starIcon);
        listItem.appendChild(deleteIcon);

        // Add the new list item to the task list
        taskList.appendChild(listItem);

        // Clear the form
        taskForm.reset();

        // Close the modal
        modal.style.display = 'none';

        // Save all tasks to localStorage
        saveTasksToLocalStorage();
        updateImportantTasksPage();
    });

    // Function to add a task to starred tasks
    function addStarredTask(taskName, dueTime) {
        const starredTasks = getStarredTasks();
        starredTasks.push({ taskName, dueTime });
        localStorage.setItem('starredTasks', JSON.stringify(starredTasks));
    }

    // Function to remove a task from starred tasks
    function removeStarredTask(taskName, dueTime) {
        const starredTasks = getStarredTasks();
        const updatedTasks = starredTasks.filter(task => !(task.taskName === taskName && task.dueTime === dueTime));
        localStorage.setItem('starredTasks', JSON.stringify(updatedTasks));
    }

    // Get starred tasks from localStorage
    function getStarredTasks() {
        return JSON.parse(localStorage.getItem('starredTasks')) || [];
    }

    // Save all tasks (starred and non-starred) to localStorage
    function saveTasksToLocalStorage() {
        const tasks = Array.from(document.querySelectorAll('li')).map(listItem => ({
            taskName: listItem.querySelector('label').textContent.split(' - ')[0],
            dueTime: listItem.querySelector('label').textContent.split(' - ')[1],
            isStarred: listItem.querySelector('.star-icon').style.color === 'yellow'
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Initialize tasks from localStorage on page load
    function loadTasksFromLocalStorage() {
        checkAndClearTasks(); // Check and clear tasks if necessary

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            const label = document.createElement('label');
            label.textContent = `${task.taskName} - ${task.dueTime}`;
            const starIcon = document.createElement('i');
            starIcon.className = 'fas fa-star star-icon';
            starIcon.style.color = task.isStarred ? 'yellow' : ''; // Set color based on star status
            starIcon.addEventListener('click', () => {
                if (starIcon.style.color === 'yellow') {
                    starIcon.style.color = '';
                    removeStarredTask(task.taskName, task.dueTime);
                } else {
                    starIcon.style.color = 'yellow';
                    addStarredTask(task.taskName, task.dueTime);
                }
                saveTasksToLocalStorage();
                updateImportantTasksPage();
            });
            // Create and add delete icon
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash delete-icon';
            deleteIcon.addEventListener('click', () => {
                listItem.remove();
                saveTasksToLocalStorage();
                updateImportantTasksPage();
            });
            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            listItem.appendChild(starIcon);
            listItem.appendChild(deleteIcon);
            taskList.appendChild(listItem);
        });
    }

    // Update Important.html page
    function updateImportantTasksPage() {
        // Send a message to the Important.html page to refresh the tasks
        if (window.postMessage) {
            window.postMessage('refreshImportantTasks', '*');
        }
    }

    loadTasksFromLocalStorage();

    // Listen for messages from other pages
    window.addEventListener('message', (event) => {
        if (event.data === 'taskDeleted') {
            // Reload tasks when a task is deleted from Important.html
            loadTasksFromLocalStorage();
        }
    });
});
