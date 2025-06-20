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
    if (currentSerialized === previousSerialized) return;

    previousSerialized = currentSerialized;

    const allItems = [...(data.seeds || []), ...(data.gear || []), ...(data.egg || []), ...(data.honey || []), ...(data.cosmetics || [])];

    const roleMentions = allItems
      .map(item => itemRoleMap?.[item.name])
      .filter(Boolean)
      .map(roleId => `<@&${roleId}>`);

    const mentionText = roleMentions.length ? roleMentions.join(' ') + ' Shop has been updated!' : null;
    const embed = formatStockEmbed(data);

    await channel.send({ content: mentionText, embeds: [embed] }).catch(console.error);
    console.log(`[Shop] Sent updated shop message.`);
  }, 30000); // every 30s
}

module.exports = { autoUpdateShop };
