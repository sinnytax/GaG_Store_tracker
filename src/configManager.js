const fs = require('fs');
const configPath = './config.json';

function getConfig() {
  const data = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(data);
}

function setShopChannel(channelId) {
  const config = getConfig();
  config.shopChannelId = channelId;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function setShopRole(roleId) {
  const config = getConfig();
  config.shopRoleId = roleId;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

module.exports = { getConfig, setShopChannel, setShopRole };
