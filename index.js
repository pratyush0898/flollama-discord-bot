const { Client, GatewayIntentBits, Events, EmbedBuilder, ActivityType } = require('discord.js');
require('dotenv').config();

// Use built-in fetch (Node.js 18+) or polyfill for older versions
const fetch = globalThis.fetch || require('node-fetch');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// Store conversation history per channel/user
const conversationHistory = new Map();
const MAX_HISTORY = 10; // Keep last 10 messages for context
const MAX_MESSAGE_LENGTH = 2000; // Discord's character limit

// Bot information
const BOT_INFO = {
  name: "Flollama",
  creator: "Pratyush Kumar",
  baseModel: "Meta's Llama 3.2 with Ollama AI infrastructure",
  purpose: "To assist users with coding, science learning, writing, and general knowledge in a clear, respectful, and neutral manner.",
  origin: "India"
};

// Function to call Flollama API
async function callFlollamaAPI(messages) {
  try {
    console.log('Calling Flollama API with messages:', messages.length);
    
    const response = await fetch('https://flollama.in/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FlollamaDiscordBot/1.0'
      },
      body: JSON.stringify({ messages }),
      timeout: 30000 // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }

    return result.trim();
  } catch (error) {
    console.error('Error calling Flollama API:', error);
    throw error;
  }
}

// Function to get conversation context
function getConversationContext(channelId, userMessage, userName) {
  const contextKey = channelId;
  
  if (!conversationHistory.has(contextKey)) {
    conversationHistory.set(contextKey, []);
  }

  const history = conversationHistory.get(contextKey);
  
  // Add user message to history
  history.push({
    role: 'user',
    content: `${userName}: ${userMessage}`
  });

  // Keep only last MAX_HISTORY messages to avoid token limits
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  return [...history]; // Return a copy
}

// Function to add bot response to history
function addBotResponseToHistory(channelId, response) {
  const contextKey = channelId;
  
  if (conversationHistory.has(contextKey)) {
    const history = conversationHistory.get(contextKey);
    history.push({
      role: 'assistant',
      content: response
    });

    // Keep history manageable
    if (history.length > MAX_HISTORY) {
      history.splice(0, history.length - MAX_HISTORY);
    }
  }
}

// Function to split long messages
function splitMessage(text, maxLength = MAX_MESSAGE_LENGTH) {
  if (text.length <= maxLength) return [text];
  
  const chunks = [];
  let currentChunk = '';
  
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        // Single sentence too long, force split
        chunks.push(sentence.substring(0, maxLength));
        currentChunk = sentence.substring(maxLength);
      }
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Function to create info embed
function createInfoEmbed() {
  return new EmbedBuilder()
    .setColor(0x00AE86)
    .setTitle('🦙 About Flollama')
    .setDescription(BOT_INFO.purpose)
    .addFields(
      { name: '👨‍💻 Creator', value: BOT_INFO.creator, inline: true },
      { name: '🌍 Origin', value: BOT_INFO.origin, inline: true },
      { name: '🤖 Base Model', value: BOT_INFO.baseModel, inline: false },
      { name: '💡 How to use', value: 'Mention me (@Flollama) or reply to my messages to start a conversation!', inline: false }
    )
    .setFooter({ text: 'Powered by Flollama API' })
    .setTimestamp();
}

// When the client is ready, run this code
client.once(Events.ClientReady, readyClient => {
  console.log(`🚀 Ready! Logged in as ${readyClient.user.tag}`);
  
  // Set bot activity
  client.user.setActivity('with AI models 🦙', { type: ActivityType.Playing });
  
  console.log(`📊 Bot is in ${client.guilds.cache.size} servers`);
  console.log('🔗 Flollama API endpoint: https://flollama.in/api/chat');
});

// Listen for messages
client.on(Events.MessageCreate, async message => {
  // Ignore messages from bots (including self)
  if (message.author.bot) return;

  // Check if bot is mentioned or if message is a reply to bot
  const isMentioned = message.mentions.has(client.user);
  const isReplyToBot = message.reference && 
    message.reference.messageId && 
    (await message.channel.messages.fetch(message.reference.messageId).catch(() => null))?.author.id === client.user.id;
  
  // Handle info command
  if (isMentioned && (message.content.toLowerCase().includes('info') || message.content.toLowerCase().includes('about'))) {
    const embed = createInfoEmbed();
    return message.reply({ embeds: [embed] });
  }

  // Handle help command
  if (isMentioned && (message.content.toLowerCase().includes('help') || message.content.toLowerCase().includes('commands'))) {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('📋 How to use Flollama')
      .setDescription('Here are the ways to interact with me:')
      .addFields(
        { name: '💬 Chat', value: 'Mention me (@Flollama) or reply to my messages', inline: false },
        { name: '📖 Get Info', value: 'Mention me with "info" or "about"', inline: false },
        { name: '❓ Get Help', value: 'Mention me with "help" or "commands"', inline: false },
        { name: '🧹 Clear History', value: 'Mention me with "clear" or "reset"', inline: false }
      )
      .setFooter({ text: 'I can help with coding, science, writing, and general knowledge!' });
    
    return message.reply({ embeds: [helpEmbed] });
  }

  // Handle clear/reset command
  if (isMentioned && (message.content.toLowerCase().includes('clear') || message.content.toLowerCase().includes('reset'))) {
    conversationHistory.delete(message.channel.id);
    return message.reply('🧹 Conversation history cleared! Starting fresh.');
  }

  if (!isMentioned && !isReplyToBot) return;

  // Show typing indicator
  const typingInterval = setInterval(() => {
    message.channel.sendTyping();
  }, 5000);

  try {
    // Clean the message content
    let cleanContent = message.content
      .replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '')
      .trim();

    if (!cleanContent) {
      cleanContent = "Hello! How can I help you today?";
    }

    // Get conversation context
    const messages = getConversationContext(
      message.channel.id, 
      cleanContent,
      message.author.displayName || message.author.username
    );

    console.log(`📨 Processing message from ${message.author.username} in ${message.guild?.name || 'DM'}`);

    // Call Flollama API
    const response = await callFlollamaAPI(messages);

    if (!response) {
      throw new Error('Empty response from API');
    }

    // Add bot response to history
    addBotResponseToHistory(message.channel.id, response);

    // Split response if it's too long
    const chunks = splitMessage(response);
    
    for (let i = 0; i < chunks.length; i++) {
      if (i === 0) {
        await message.reply(chunks[i]);
      } else {
        await message.channel.send(chunks[i]);
      }
      
      // Small delay between chunks to avoid rate limits
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('✅ Response sent successfully');

  } catch (error) {
    console.error('❌ Error processing message:', error);
    
    let errorMessage = '🚫 Sorry, I encountered an error while processing your message.';
    
    if (error.message.includes('timeout')) {
      errorMessage += ' The request timed out. Please try again.';
    } else if (error.message.includes('HTTP error')) {
      errorMessage += ' The AI service is temporarily unavailable. Please try again later.';
    } else {
      errorMessage += ' Please try again in a moment.';
    }

    await message.reply(errorMessage);
  } finally {
    clearInterval(typingInterval);
  }
});

// Handle errors
client.on('error', error => {
  console.error('❌ Discord client error:', error);
});

client.on('warn', warning => {
  console.warn('⚠️ Discord client warning:', warning);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// Login to Discord
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN not found in environment variables');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN).catch(error => {
  console.error('❌ Failed to login:', error);
  process.exit(1);
});
