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
    .setName("item-desc")
    .setDescription(`Preview an item`)
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the item")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async autocomplete(interaction) {
    let names = (await execute(`SELECT item_name FROM shop`)).map(
      (x) => x["item_name"]
    );
    console.log(names);
    const focusedValue = interaction.options.getFocused();
    const filtered = names.filter((choice) =>
      choice.trim().toLowerCase().startsWith(focusedValue.trim().toLowerCase())
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  async execute(interaction) {
    let name = interaction.options.getString("name");
    let data = await execute(`SELECT * FROM shop WHERE item_name = ?`, name);
    const Embed = new EmbedBuilder()
      .setTitle(`🔎 | ${name}`)
      .setImage(data[0].item_image)
      .setDescription(
        `> ${interaction.member}, below you can find the details for **${name}**\n\n> **Name:** ${name}\n> **Description:** ${data[0].item_description}\n> **Stock:** ${data[0].stock}x\n> **Price:** ${data[0].item_price}✨`
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
