/**
 * Onboarding Logic
 * Handles mandatory channel follow verification
 */

const onboarding = {
    channelUrl: 'https://t.me/dontplayjustdoit', // Replace with actual channel link

    init() {
        console.log('Onboarding initialized');
        this.setupListeners();
    },

    setupListeners() {
        const btnFollow = document.getElementById('btn-follow');
        const btnVerify = document.getElementById('btn-verify');

        if (btnFollow) {
            btnFollow.addEventListener('click', (e) => {
                e.preventDefault();
                const tg = window.Telegram.WebApp;
                tg.openTelegramLink(this.channelUrl);
                console.log('User clicking follow via SDK');
            });
        }

        // Logic handled in app.js for now, but we can encapsulate more here if needed
    },

    async checkFollowStatus() {
        // In a real production app:
        // 1. Send user ID to your backend
        // 2. Backend calls bot.getChatMember(channelId, userId)
        // 3. Backend returns status: member, creator, administrator, or left/kicked

        // For MVP, we use the confirmation dialog in app.js
        return true;
    }
};

document.addEventListener('DOMContentLoaded', () => onboarding.init());
