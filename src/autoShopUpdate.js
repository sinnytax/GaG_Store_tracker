const { formatStockEmbed, fetchInStockItems } = require('./stock');
const { getConfig } = require('./configManager');

let previousSerialized = null;
let lastMessage = null;

async function autoUpdateShop(client) {
  const { shopChannelId, shopRoleId } = getConfig();
  if (!shopChannelId) return;

  const channel = await client.channels.fetch(shopChannelId).catch(console.error);
  if (!channel || !channel.isTextBased()) {
    console.error('❌ Invalid or non-text channel');
    return;
  }

  setInterval(async () => {
    const data = await fetchInStockItems();
    const currentSerialized = JSON.stringify(data);

    if (currentSerialized !== previousSerialized) {
      console.log(`[Shop] Detected update — sending new message.`);

      const embed = formatStockEmbed(data);
      const content = shopRoleId ? `<@&${shopRoleId}> Shop has been updated!` : null;

      // 🗑️ Delete previous message
      if (lastMessage && !lastMessage.deleted) {
        await lastMessage.delete().catch(err => {
          console.warn('Could not delete previous message:', err.message);
        });
      }

      // ✉️ Send new message
      lastMessage = await channel.send({ content, embeds: [embed] }).catch(console.error);

      previousSerialized = currentSerialized;
    }
  }, 30000); // every 30 seconds
}

module.exports = { autoUpdateShop };
