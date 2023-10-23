## Run Locally:


To install dependencies:
1. Run `npm install` to install the necessary dependencies.

    ```
    npm install
    ```

To provide cookies to your niner account:

2. Run `npx playwright open --save-storage niner.json` to open the browser and save the storage data to a file named `niner.json`.
    ```
    npx playwright open --save-storage niner.json
    ```

To run playwright tests:

3. Run `node SchedulePantry.js` to execute the playwright tests.
    ```
    node SchedulePantry.js
    ```

To get Telegram notifications:

4. Create a bot on Telegram using BotFather and generate a token. Add the token to your `.env` file under the name `BOT_TOKEN`.
    https://medium.com/geekculture/generate-telegram-token-for-bot-api-d26faf9bf064

5. Get the chat ID of the group or user where you want the message to be delivered. You can use the following API endpoint to find your chat ID: `https://api.telegram.org/bot[token]/getUpdates`. Replace `[token]` with your bot token. Start the bot and send a message to it to retrieve your chat ID. Add the chat ID to your `.env` file under the name `CHAT_ID`.
    ```
    https://api.telegram.org/bot[token]/getUpdates
    ```
    https://sean-bradley.medium.com/get-telegram-chat-id-80b575520659


Sample `.env` file:
```
BOT_TOKEN="your_bot_token" CHAT_ID="your_chat_id"
```

## How to Deploy to Netlify

To deploy to Netlify:

1. Update the schedule in `deploy.js` under the `netlify/functions` folder.
2. Upload all files, including `niner.json`, to Netlify.
3. Add a `.env` file to Netlify with the following environment variables:
