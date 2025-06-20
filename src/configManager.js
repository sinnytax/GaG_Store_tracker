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

function addShopRole(roleId) {
  const config = getConfig();
  if (!config.shopRoleIds.includes(roleId)) {
    config.shopRoleIds.push(roleId);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}

function removeShopRole(roleId) {
  const config = getConfig();
  config.shopRoleIds = config.shopRoleIds.filter(id => id !== roleId);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
function setItemRole(itemName, roleId) {
  const config = getConfig();
  config.itemRoleMap = config.itemRoleMap || {};
  config.itemRoleMap[itemName] = roleId;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function removeItemRole(itemName) {
  const config = getConfig();
  config.itemRoleMap = config.itemRoleMap || {};
  delete config.itemRoleMap[itemName];
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

module.exports = {
  getConfig,
  setShopChannel,
  addShopRole,
  removeShopRole,
  setItemRole,
  removeItemRole
};

