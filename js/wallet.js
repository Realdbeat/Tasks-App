let tonConnectUI;

async function initWallet() {
    // Initialize TonConnect UI
    tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://tasksapps.rav.com.ng/tonconnect-manifest.json',

        buttonRootId: 'ton-connect'
    });

    // Listen for wallet connection status
    tonConnectUI.onStatusChange(wallet => {
        if (wallet) {
            console.log('Wallet connected:', wallet);
            updateWithdrawButton();
        } else {
            console.log('Wallet disconnected');
            updateWithdrawButton();
        }
    });
}

function updateWithdrawButton() {
    const btn = document.getElementById('btn-withdraw');
    const isConnected = tonConnectUI.connected;
    const hasEnoughBalance = state.balance >= 100;

    if (isConnected) {
        btn.disabled = !hasEnoughBalance;
        btn.textContent = hasEnoughBalance ? 'Withdraw RGL' : 'Min 100 RGL required';
    } else {
        btn.disabled = true;
        btn.textContent = 'Connect Wallet to Withdraw';
    }
}

// Add click listener to withdraw button
document.getElementById('btn-withdraw').addEventListener('click', async () => {
    if (state.balance < 100) return;

    try {
        window.Telegram.WebApp.showConfirm(`Confirm withdrawal of ${state.balance.toFixed(0)} RGL to your TON wallet?`, async (confirmed) => {
            if (confirmed) {

                // Mock transaction request
                // In a real app, you would send a transaction to your contract or backend
                setTimeout(() => {
                    window.Telegram.WebApp.showAlert("Withdrawal request submitted! Your TON will arrive shortly.");

                    state.balance = 0;
                    updateBalanceDisplay();
                    updateWithdrawButton();
                }, 2000);
            }
        });
    } catch (e) {
        console.error('Withdrawal error:', e);
        window.Telegram.WebApp.showAlert("Failed to initiate withdrawal.");
    }
});

// Update button whenever balance changes
window.addEventListener('balanceUpdated', updateWithdrawButton);

document.addEventListener('DOMContentLoaded', initWallet);
