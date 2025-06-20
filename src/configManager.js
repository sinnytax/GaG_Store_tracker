const fs = require('fs');
const configPath = './config.json';

function getConfig() {
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function setShopChannel(id) {
  const config = getConfig();
  config.shopChannelId = id;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function addItemRole(itemName, roleId) {
  const config = getConfig();
  if (!config.itemRoleMap) config.itemRoleMap = {};
  config.itemRoleMap[itemName] = roleId;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function removeItemRole(itemName) {
  const config = getConfig();
  if (config.itemRoleMap) {
    delete config.itemRoleMap[itemName];
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}

module.exports = {
  getConfig,
  setShopChannel,
  addItemRole,
  removeItemRole
};
