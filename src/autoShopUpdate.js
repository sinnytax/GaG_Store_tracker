const { formatStockEmbed, fetchInStockItems } = require('./stock');
const { getConfig } = require('./configManager');

let previousSerialized = null;
let lastMessage = null;

async function autoUpdateShop(client) {
  const { shopChannelId, shopRoleId } = getConfig();
  if (!shopChannelId) return;

  const channel = await client.channels.fetch(shopChannelId).catch(console.error);
  if (!channel) {
    console.error('❌ Invalid channel ID');
    return;
  }

  setInterval(async () => {
    const data = await fetchInStockItems();
    const currentSerialized = JSON.stringify(data);

    if (currentSerialized !== previousSerialized) {
      const embed = formatStockEmbed(data);

      const content = shopRoleId ? `<@&${shopRoleId}> Shop has been updated!` : null;

      if (lastMessage && !lastMessage.deleted) {
        await lastMessage.edit({ content, embeds: [embed] }).catch(console.error);
      } else {
        lastMessage = await channel.send({ content, embeds: [embed] });
      }

      previousSerialized = currentSerialized;
    }
  }, 30000);
}

module.exports = { autoUpdateShop };
