require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { fetchInStockItems, formatStockEmbed } = require('./stock');
const { autoUpdateShop } = require('./autoShopUpdate');
const { setShopChannel, addShopRole, removeShopRole, setItemRole, removeItemRole } = require('./configManager');

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
            case 'setitemrole':
              if (!message.member.permissions.has('Administrator')) return message.reply('❌ Admins only!');
              const role = message.mentions.roles.first();
              const item = args.slice(1).join(' ');
              if (!role || !item) return message.reply('❌ Usage: `!setitemrole @Role ItemName`');
            
              setItemRole(item, role.id);
              return message.reply(`✅ Linked item **${item}** to role <@&${role.id}>`);
            
            case 'removeitemrole':
              if (!message.member.permissions.has('Administrator')) return message.reply('❌ Admins only!');
              const itemName = args.join(' ');
              if (!itemName) return message.reply('❌ Usage: `!removeitemrole ItemName`');
            
              removeItemRole(itemName);
              return message.reply(`✅ Removed role mapping for item **${itemName}**`);
          
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
