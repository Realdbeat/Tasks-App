// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Application State
const state = {
    user: {
        id: tg.initDataUnsafe?.user?.id || 0,
        firstName: tg.initDataUnsafe?.user?.first_name || 'Guest',
        photo: tg.initDataUnsafe?.user?.photo_url || ''
    },
    balance: parseFloat(localStorage.getItem('rgl_balance')) || 0,
    hasFollowed: localStorage.getItem('has_followed') === 'true'
};

// UI Elements
const onboardingScreen = document.getElementById('onboarding-screen');
const mainContent = document.getElementById('main-content');
const rglBalanceDisplay = document.getElementById('rgl-balance');
const userNameDisplay = document.getElementById('user-name');
const userPhotoDisplay = document.getElementById('user-photo');
const tabButtons = document.querySelectorAll('.tab-item');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize UI
function initApp() {
    // Set user info
    userNameDisplay.textContent = state.user.firstName;
    if (state.user.photo) {
        userPhotoDisplay.src = state.user.photo;
        userPhotoDisplay.style.display = 'block';
    }

    updateBalanceDisplay();

    // Check onboarding status
    if (state.hasFollowed) {
        showMainApp();
    } else {
        onboardingScreen.classList.add('active');
    }

    // Set Telegram theme color
    document.documentElement.style.setProperty('--primary-color', tg.themeParams.button_color || '#0088cc');
}

function updateBalanceDisplay() {
    rglBalanceDisplay.textContent = state.balance.toFixed(2);
    localStorage.setItem('rgl_balance', state.balance);
    window.dispatchEvent(new Event('balanceUpdated'));
}

function showMainApp() {
    onboardingScreen.classList.remove('active');
    mainContent.classList.add('active');
}

// Tab Navigation
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');

        // Update buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            }
        });
    });
});

// Event Listeners for Onboarding (in onboarding.js eventually, but connecting base here)
document.getElementById('btn-verify').addEventListener('click', () => {
    // In a real app, this would call a backend to check getChatMember
    tg.showConfirm("Did you follow our channel?", (confirmed) => {
        if (confirmed) {
            state.hasFollowed = true;
            localStorage.setItem('has_followed', 'true');
            showMainApp();
            tg.showAlert("Success! You have earned 5 RGL for joining.");
            state.balance += 5;
            updateBalanceDisplay();
        }
    });
});

// Start the app
window.addEventListener('load', initApp);
