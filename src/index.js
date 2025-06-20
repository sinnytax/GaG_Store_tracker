require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { fetchInStockItems, formatStockEmbed } = require('./stock');
const { autoUpdateShop } = require('./autoShopUpdate');
const { setShopChannel, setShopRole } = require('./configManager');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;
  
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    switch (command) {
        case 'stock': {
            const data = await fetchInStockItems();
            const embed = formatStockEmbed(data);
            message.reply({ embeds: [embed] });
            break;
          }
        case "setshopchannel":
            if (!message.member.permissions.has("Administrator")) {
                return message.reply("❌ You need administrator permission to do this.")
            }
            setShopChannel(message.channel.id);
            message.reply(`✅ Shop updates will now post in <#${message.channel.id}>`);
            break;
        case "setshoprole":
            if (!message.member.permissions.has('Administrator')) {
                return message.reply('❌ You need administrator permission to do this.');
              }
            const role = message.mentions.roles.first();
            if (!role) {
                return message.reply('❌ Please mention a role. Example: `!setshoprole @ShopPing`');
            }

            setShopRole(role.id);
            message.reply(`✅ Shop ping role set to <@&${role.id}>`);
            break;
    }
  });
  
  // Slash-based (/stock)
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    const { commandName } = interaction;
  
    switch (commandName) {
        case 'stock': {
            await interaction.deferReply();
            const data = await fetchInStockItems();
            const embed = formatStockEmbed(data);
            await interaction.editReply({ embeds: [embed] });
            break;
          }
    }
  });

client.login(process.env.TOKEN);
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  autoUpdateShop(client); // 🔁 Auto shop updates start
});
