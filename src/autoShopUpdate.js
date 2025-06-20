const { formatStockEmbed, fetchInStockItems } = require('./stock');
const { getConfig } = require('./configManager');

let previousSerialized = null;

async function autoUpdateShop(client) {
  const { shopChannelId, itemRoleMap } = getConfig();
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

      // 🔍 Check which items are in stock and build a dynamic mention list
      const roleMentions = new Set();
      const allItems = [...(data.seeds || []), ...(data.gear || []), ...(data.honey || []), ...(data.cosmetics || []), ...(data.egg || [])];

      allItems.forEach(item => {
        const roleId = itemRoleMap?.[item.name];
        if (roleId) roleMentions.add(`<@&${roleId}>`);
      });

      const content = Array.from(roleMentions).join(' ') || null;

      await channel.send({ content, embeds: [embed] }).catch(console.error);
      previousSerialized = currentSerialized;
    }
  }, 30000);
}

module.exports = { autoUpdateShop };
