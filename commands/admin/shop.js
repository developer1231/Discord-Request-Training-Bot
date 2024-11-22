const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const fs = require("fs");
const n = require("../../config.json");
const { execute, makeid } = require("../../database/database");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription(`View the shop`),
  async execute(interaction) {
    let allData = await execute(`SELECT * FROM shop`);
    let items = allData.map((item) => ({
      name: `> ` + item.item_name,
      value: `> \\- *${item.item_description}*\n> **Price:** ${item.item_price}✨`,
    }));

    const Embed = new EmbedBuilder()
      .setTitle("🛒 | Shop")
      .setDescription(
        `> Dear ${interaction.member}, below you can find the shop that is configured by the Administrators of the server.\n> Use */buy (name)* to buy an item\n> Use */item-desc* to view more information about the item.`
      )
      .setTimestamp()
      .setAuthor({
        name: `${interaction.client.user.username}`,
        iconURL: `${interaction.client.user.displayAvatarURL()}`,
      })
      .setColor("#6488EA")
      .addFields(items);

    return interaction.reply({ ephemeral: true, embeds: [Embed] });
  },
};
