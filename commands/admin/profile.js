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
    .setName("profile")
    .setDescription(`View Adventure Profile`)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user's profile to view")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user = interaction.options.getMember("user");
    let userData = await execute(`SELECT * FROM users WHERE member_id =?`, [
      user.id,
    ]);

    if (userData.length == 0) {
      await execute(
        `INSERT INTO users (member_id, points, stars_caught) VALUES (?, ?, ?)`,
        [user.id, 0, 0]
      );
    }
    userData = await execute(`SELECT * FROM users WHERE member_id =?`, [
      user.id,
    ]);
    let inventory = await execute(
      `SELECT * FROM inventory WHERE member_id = ?`,
      [user.id]
    );
    let dataString = "";
    for (const key in inventory) {
      let itemData = await execute(`SELECT * FROM shop WHERE id =?`, [
        inventory[key].item_id,
      ]);
      dataString += `**${itemData[0].item_name}** - ${itemData[0].item_price}✨\n> `;
    }
    const Embed = new EmbedBuilder()
      .setTitle(`👤 | Profile`)
      .setThumbnail(`${user.user.displayAvatarURL()}`)
      .setDescription(
        `> ${
          interaction.member
        }, below you can find ${user}'s **Star Catching** profile.\n### General Profile\n> **Stars Caught** ${
          userData[0].stars_caught
        }\n> **Balance:** ${userData[0].points}✨\n> **Items Owned:** ${
          inventory.length
        }\n### Inventory\n> ${
          dataString.length > 0
            ? dataString.substring(0, dataString.length - 2)
            : "No items yet."
        }`
      )
      .setTimestamp()
      .setAuthor({
        name: `${interaction.client.user.username}`,
        iconURL: `${interaction.client.user.displayAvatarURL()}`,
      })
      .setColor("#6488EA");

    return interaction.reply({ ephemeral: true, embeds: [Embed] });
  },
};
