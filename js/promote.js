const promote = {
    tonPerRgl: 0.001, // 0.1 TON per 100 RGL
    platformFee: 0.05, // 0.05 TON fixed fee

    init() {
        const form = document.getElementById('add-task-form');
        if (form) {
            form.addEventListener('input', () => this.updateCost());
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    },

    updateCost() {
        const reward = parseInt(document.getElementById('task-reward').value) || 0;
        const target = parseInt(document.getElementById('task-target').value) || 0;

        const totalRgl = reward * target;
        const tonCost = (totalRgl * this.tonPerRgl) + this.platformFee;

        document.getElementById('total-ton-cost').textContent = `${tonCost.toFixed(2)} TON`;
    },

    async handleSubmit(e) {
        e.preventDefault();

        if (!tonConnectUI.connected) {
            window.Telegram.WebApp.showAlert("Please connect your wallet in the Wallet tab first!");
            // Switch to wallet tab
            document.querySelector('[data-tab="wallet"]').click();
            return;
        }

        const taskData = {
            title: document.getElementById('task-title').value,
            action: document.getElementById('task-action').value,
            url: document.getElementById('task-url').value,
            reward: parseInt(document.getElementById('task-reward').value),
            target: parseInt(document.getElementById('task-target').value)
        };

        const totalTon = (taskData.reward * taskData.target * this.tonPerRgl) + this.platformFee;
        const amountInNano = (totalTon * 1000000000).toString();

        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
            messages: [
                {
                    address: "EQCD39VS5jcptHL8vMjEXCc_n_Hduf57En6K-7vkyS9O22zp", // Example destination (Replace with your wallet)
                    amount: amountInNano
                }
            ]
        };

        try {
            window.Telegram.WebApp.showProgress();

            // In real app, we wait for transaction. 
            // For MVP demonstrations, we simulate successful payment if TonConnect is active.
            const result = await tonConnectUI.sendTransaction(transaction);

            if (result) {
                // Payment successful, now save to backend
                this.saveTask(taskData);
            }
        } catch (error) {
            console.error('Payment error:', error);
            window.Telegram.WebApp.showAlert("Transaction was cancelled or failed.");
        } finally {
            window.Telegram.WebApp.hideProgress();
        }
    },

    async saveTask(taskData) {
        try {
            const response = await fetch('api/create_task.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            const result = await response.json();
            if (result.success) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                window.Telegram.WebApp.showAlert("Task published successfully!");
                document.getElementById('add-task-form').reset();
                this.updateCost();

                // Refresh tasks and switch to tasks tab
                if (typeof renderTasks === 'function') {
                    renderTasks();
                }
                document.querySelector('[data-tab="tasks"]').click();
            } else {
                window.Telegram.WebApp.showAlert("Failed to save task. Please contact support.");
            }
        } catch (error) {
            console.error('Save error:', error);
            window.Telegram.WebApp.showAlert("Error connecting to server.");
        }
    }
};

document.addEventListener('DOMContentLoaded', () => promote.init());
