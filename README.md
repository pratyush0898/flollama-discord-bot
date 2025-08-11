# 🦙 Flollama Discord Bot

A Discord bot powered by Flollama AI that assists users with coding, science learning, writing, and general knowledge in a clear, respectful, and neutral manner.

## 📋 About Flollama

- **Name:** Flollama (a combination of "Flow" and Llama/Ollama)
- **Creator:** Pratyush Kumar, a young developer from India
- **Base Model:** Meta's Llama 3.2 language model with Ollama AI infrastructure
- **Purpose:** To assist users with coding, science learning, writing, and general knowledge
- **Goal:** Provide helpful and accurate responses while being transparent about origins and limitations

## ✨ Features

- 🎯 **Smart Responses**: Responds to mentions and replies
- 💬 **Context Awareness**: Maintains conversation history per channel
- 📚 **Multiple Topics**: Coding, science, writing, general knowledge
- 🔧 **Error Handling**: Graceful error handling with user-friendly messages
- 📏 **Message Splitting**: Automatically handles long responses
- 🎨 **Rich Embeds**: Beautiful info and help commands
- 🧹 **History Management**: Clear conversation history when needed

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- A Discord account and server
- Basic knowledge of Discord bots and JavaScript

### 1. Clone the Repository

```bash
git clone https://github.com/pratyush0898/flollama-discord-bot.git
cd flollama-discord-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Discord Bot

#### Step 1: Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give your bot a name (e.g., "Flollama")
4. Click "Create"

#### Step 2: Create Bot User
1. Go to the "Bot" section in the left sidebar
2. Click "Add Bot"
3. Copy the bot token (you'll need this later)

#### Step 3: Configure Bot Settings
In the Bot section, make sure to enable:
- ✅ **Message Content Intent** (Required!)
- ✅ **Server Members Intent** (Optional)
- ✅ **Presence Intent** (Optional)

#### Step 4: Set Bot Permissions
Go to the "OAuth2" → "URL Generator" section:

**Scopes:**
- ✅ `bot`
- ✅ `applications.commands` (for future slash commands)

**Bot Permissions:**
- ✅ **Send Messages** (Required)
- ✅ **Read Messages** (Required)
- ✅ **Read Message History** (Required)
- ✅ **Use External Emojis** (Optional)
- ✅ **Add Reactions** (Optional)
- ✅ **Embed Links** (Recommended)
- ✅ **Attach Files** (Optional)
- ✅ **Mention Everyone** (Optional, use carefully)

**Minimum Required Permissions Integer:** `274877906944`

### 4. Environment Setup

Create a `.env` file in the project root:

```env
# Discord Bot Token (Required)
DISCORD_TOKEN=your_discord_bot_token_here

# Optional: Custom settings
NODE_ENV=production
```

### 5. Run the Bot

#### Development Mode (with auto-restart):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

### 6. Invite Bot to Server

1. Copy the generated URL from Discord Developer Portal
2. Open the URL in your browser
3. Select your server and authorize the bot

## 🎮 Usage

### Basic Commands

| Action | Command | Example |
|--------|---------|---------|
| **Chat** | Mention the bot | `@Flollama Hello! How are you?` |
| **Reply** | Reply to bot's message | Just reply to any bot message |
| **Get Info** | Mention + "info" | `@Flollama info` |
| **Get Help** | Mention + "help" | `@Flollama help` |
| **Clear History** | Mention + "clear" | `@Flollama clear` |

### Example Interactions

```
User: @Flollama Can you help me debug this Python code?

Flollama: I'd be happy to help you debug your Python code! Please share 
the code you're having trouble with, and let me know what error messages 
or unexpected behavior you're experiencing...
```

```
User: @Flollama Explain quantum computing simply

Flollama: Quantum computing is like having a super-powered calculator 
that can explore many possible solutions simultaneously...
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `DISCORD_TOKEN` | ✅ Yes | Your Discord bot token | None |
| `NODE_ENV` | ❌ No | Environment mode | `development` |

### Bot Settings

You can modify these settings in `index.js`:

```javascript
const MAX_HISTORY = 10; // Conversation history per channel
const MAX_MESSAGE_LENGTH = 2000; // Discord's character limit
```

## 📊 API Information

The bot uses the Flollama API endpoint:
- **URL:** `https://flollama.in/api/chat`
- **Method:** POST
- **Content-Type:** application/json
- **Streaming:** Yes (handled automatically)

### API Request Format
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ]
}
```

## 🛠️ Development

### Project Structure
```
flollama-discord-bot/
├── index.js          # Main bot file
├── package.json      # Dependencies and scripts
├── README.md         # This file
├── .env              # Environment variables (create this)
├── .gitignore        # Git ignore file
└── node_modules/     # Dependencies (auto-generated)
```

### Scripts
- `npm start` - Run the bot in production mode
- `npm run dev` - Run the bot in development mode with auto-restart

### Adding New Features

1. **Add a new command:**
```javascript
if (isMentioned && message.content.toLowerCase().includes('your-command')) {
  // Your command logic here
  return message.reply('Response');
}
```

2. **Modify API calls:**
```javascript
// Edit the callFlollamaAPI function
async function callFlollamaAPI(messages) {
  // Your modifications here
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Bot doesn't respond to mentions**
   - ✅ Check if Message Content Intent is enabled
   - ✅ Verify bot has "Send Messages" permission
   - ✅ Make sure bot is online (check Discord)

2. **"Missing Permissions" error**
   - ✅ Re-invite bot with correct permissions
   - ✅ Check channel-specific permissions

3. **API timeout errors**
   - ✅ Check your internet connection
   - ✅ Verify Flollama API is accessible
   - ✅ Try again after a few minutes

4. **Bot appears offline**
   - ✅ Check console for error messages
   - ✅ Verify DISCORD_TOKEN is correct
   - ✅ Restart the bot

### Debug Mode

Run with debug information:
```bash
NODE_ENV=development npm start
```

### Logs

The bot provides detailed console logs:
- 🚀 Startup messages
- 📨 Message processing
- ✅ Successful responses
- ❌ Error messages
- ⚠️ Warnings

## 🔐 Security

### Best Practices

1. **Never share your bot token**
2. **Use environment variables for secrets**
3. **Regularly rotate your bot token**
4. **Limit bot permissions to minimum required**
5. **Monitor bot usage and logs**

### Token Security
```bash
# Add .env to .gitignore
echo ".env" >> .gitignore

# Never commit tokens to version control
git add .gitignore
git commit -m "Add .gitignore for environment variables"
```

## 🚀 Deployment

### Heroku Deployment

1. **Create Heroku app:**
```bash
heroku create your-flollama-bot
```

2. **Set environment variables:**
```bash
heroku config:set DISCORD_TOKEN=your_token_here
```

3. **Deploy:**
```bash
git push heroku main
```

### Railway Deployment

1. **Connect your GitHub repo to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on git push**

### VPS/Server Deployment

1. **Install PM2 for process management:**
```bash
npm install -g pm2
```

2. **Start bot with PM2:**
```bash
pm2 start index.js --name "flollama-bot"
pm2 startup
pm2 save
```

## 📈 Monitoring

### Health Checks
The bot logs important events:
- Bot startup and login
- Message processing
- API calls and responses
- Errors and warnings

### Performance Metrics
- Response time to messages
- API call success/failure rates
- Memory usage
- Number of active servers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pratyush Kumar** - Creator of Flollama
- **Meta** - Llama 3.2 language model
- **Ollama** - AI infrastructure
- **Discord.js** - Discord API wrapper

## 📞 Support

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/pratyush0898/flollama-discord-bot/issues)
- 💬 **Questions:** [GitHub Discussions](https://github.com/pratyush0898/flollama-discord-bot/discussions)
- 📧 **Email:** pratyush@flollama.in

---

### 🎉 Ready to Get Started?

1. Follow the setup instructions above
2. Invite your bot to a Discord server
3. Mention the bot and start chatting!

**Happy coding with Flollama! 🦙✨**