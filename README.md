# Deployment Guide: RGL Tasks Telegram Mini App

Follow these steps to deploy your Mini App and make it accessible on Telegram.

## 1. Prepare for Deployment

Before deploying, make sure you have:
- A host with HTTPS (e.g., GitHub Pages, Vercel, Netlify).
- A Telegram Bot created via [@BotFather](https://t.me/BotFather).

## 2. Host the Files

### GitHub Pages (Recommended for this project)
1. Push your code to a GitHub repository.
2. Go to **Settings > Pages**.
3. Select the branch (usually `main`) and folder (`/root`).
4. Once deployed, copy your site URL (e.g., `https://yourname.github.io/rgl-tasks/`).

## 3. Register the Mini App in Telegram

1. Open [@BotFather](https://t.me/BotFather) in Telegram.
2. Send `/newapp`.
3. Select your bot.
4. Provide a title and description.
5. Upload an icon (640x360 pixels).
6. **Key Step**: When asked for the **URL**, paste your hosted site URL.
7. Provide a short name for the app URL (e.g., `rgl_tasks`).
8. You will receive a link like `t.me/your_bot/rgl_tasks`.

## 4. Wallet Connectivity (TonConnect)

To use TonConnect in production:
1. Update `manifestUrl` in `js/wallet.js` to point to a permanent JSON file on your server.
2. Ensure your site is served over **HTTPS**, as TonConnect and Telegram SDK require it.

## 5. Mandatory Channel Verification (Optional Backend)

The current "verification" is mocked. To truly verify follows:
1. Set up a simple Node.js or Python backend.
2. Use the `getChatMember` method from the Telegram Bot API.
3. Your app should call your backend with the `user_id` from `tg.initDataUnsafe`.
