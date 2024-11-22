const fs = require("fs");
const config = require("../config.json");
const { Initialization, execute } = require("../database/database");
const { dropCrystals } = require("../helpers/helper");
const {
  Events,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    Initialization();
    let dropChannel = await client.channels.cache.find(
      (r) => r.id === "1306057476612821073" // Replace with the specific channel ID
    );
    function startRandomDrops() {
      // Set an interval to run every random time between 5 and 30 seconds
      setInterval(async () => {
        if (dropChannel) {
          await dropCrystals(dropChannel, client.user.displayAvatarURL());
        } else {
          console.log("Channel not found.");
        }
      }, Math.random() * (10800000 - 600000) + 600000); // 30 mins to 10 min
    }

    startRandomDrops();
  },
};
