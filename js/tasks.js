const tasks = [
    {
        id: 'task_1',
        title: 'Follow our Twitter',
        reward: 10,
        url: 'https://twitter.com/your_handle',
        action: 'Follow'
    },
    {
        id: 'task_2',
        title: 'Join Community Group',
        reward: 15,
        url: 'https://t.me/your_community',
        action: 'Join'
    },
    {
        id: 'task_3',
        title: 'Visit Website',
        reward: 5,
        url: 'https://google.com',
        action: 'Visit'
    }
];

function renderTasks() {
    const list = document.getElementById('tasks-list');
    const completedTasks = JSON.parse(localStorage.getItem('completed_tasks') || '[]');

    list.innerHTML = tasks.map(task => {
        const isCompleted = completedTasks.includes(task.id);
        return `
            <div class="task-item" id="item-${task.id}">
                <div class="task-info">
                    <h4>${task.title}</h4>
                    <span class="task-reward">+${task.reward} RGL</span>
                </div>
                ${isCompleted ?
                '<span class="status-done">✅ Done</span>' :
                `<button class="btn btn-primary btn-task" onclick="handleTaskClick('${task.id}')">${task.action}</button>`
            }
            </div>
        `;
    }).join('');
}

function handleTaskClick(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Open URL
    window.Telegram.WebApp.openLink(task.url);

    // Mock verification (Wait 5 seconds then show claim button)
    const btn = document.querySelector(`#item-${taskId} .btn-task`);
    btn.textContent = 'Verifying...';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = 'Claim Reward';
        btn.disabled = false;
        btn.onclick = () => claimReward(taskId);
    }, 5000);
}

function claimReward(taskId) {
    const task = tasks.find(t => t.id === taskId);
    const completedTasks = JSON.parse(localStorage.getItem('completed_tasks') || '[]');

    if (!completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
        localStorage.setItem('completed_tasks', JSON.stringify(completedTasks));

        state.balance += task.reward;
        updateBalanceDisplay();

        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        window.Telegram.WebApp.showAlert(`You earned ${task.reward} RGL!`);

        renderTasks();
    }
}

// Initial render
document.addEventListener('DOMContentLoaded', renderTasks);
