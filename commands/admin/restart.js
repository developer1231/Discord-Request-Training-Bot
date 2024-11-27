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
    .setName("restart")
    .setDescription(`Restart the bot`),
  async execute(interaction) {
    if (interaction.member.id !== n.owner_id) {
      const Embed = new EmbedBuilder()
        .setTitle(":x: | Insufficient Permissions")
        .setDescription(
          `> ${interaction.member}, you don't have the required \`\`Owner\`\` permissions to be able to use this command.\n> Please refrain from using this command.`
        )
        .setTimestamp()
        .setAuthor({
          name: `${interaction.client.user.username}`,
          iconURL: `${interaction.client.user.displayAvatarURL()}`,
        })
        .setColor("Red");
      return interaction.reply({ ephemeral: true, embeds: [Embed] });
    }
    const Success = new EmbedBuilder()
      .setTitle(":white_check_mark: | Successfully Scheduled Downtime")
      .setDescription(
        `> ${interaction.member}, the bot will restart after exactly **1 minute**.\n> Please do not use the bot in the mean time.`
      )
      .setTimestamp()
      .setAuthor({
        name: `${interaction.client.user.username}`,
        iconURL: `${interaction.client.user.displayAvatarURL()}`,
      })
      .setColor("#686c70");
    await interaction.reply({ ephemeral: true, embeds: [Success] });
    setTimeout(async () => {
      process.exit(0);
    }, 60000);
  },
};
