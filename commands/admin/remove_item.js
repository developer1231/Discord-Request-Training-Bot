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
    .setName("remove-item")
    .setDescription(`Remove an item`)
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

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      const Embed = new EmbedBuilder()
        .setTitle(":x: | Invalid Permissions")
        .setDescription(
          `> To use this command, you must have the required **Administrator** permissions.`
        )
        .setTimestamp()
        .setAuthor({
          name: `${interaction.client.user.username}`,
          iconURL: `${interaction.client.user.displayAvatarURL()}`,
        })
        .setColor("#6488EA");

      return interaction.reply({ ephemeral: true, embeds: [Embed] });
    }

    await execute(`DELETE FROM shop WHERE item_name = ?`, name);
    const Embed = new EmbedBuilder()
      .setTitle(":white_check_mark: | Successfully Deleted")
      .setDescription(
        `> The item with name **${name}** was successfully deleted from the shop.`
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
