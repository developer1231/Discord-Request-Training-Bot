const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActivityType,
  Status,
} = require("discord.js");
const fs = require("fs");
const n = require("../../config.json");
const { execute, makeid } = require("../../database/database");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setstatus")
    .setDescription(`Set the bot status`)
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("The new status")
        .setRequired(true)
        .addChoices(
          { name: "Online", value: "online" },
          { name: "Idle", value: "idle" },
          { name: "Do Not Disturb", value: "dnd" },
          { name: "Invisible", value: "invisible" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("activity")
        .setDescription(
          "The activity type (e.g., Watching, Listening, Playing)"
        )
        .setRequired(false)
        .addChoices(
          { name: "Playing", value: "Playing" },
          { name: "Watching", value: "Watching" },
          { name: "Listening", value: "Listening" },
          { name: "Streaming", value: "Streaming" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("activityname")
        .setDescription("The activity name")
        .setRequired(false)
    ),

  async execute(interaction) {
    const status = interaction.options.getString("status");
    const activityType = interaction.options.getString("activity");
    const activityName = interaction.options.getString("activityname");
    function switcher() {
      switch (status) {
        case "online":
          return "🟢 Online";
        case "idle":
          return "🟠 Idle";
        case "dnd":
          return "🔴 Do Not Disturb";
        case "invisible":
          return "🔘 Invisible";
        default:
          return "Unknown";
      }
    }
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
    let data = [];

    if (activityType && activityName) {
      console.log("yes");
      data.push({ name: activityName, type: ActivityType[activityType] });
    }
    console.log(status)
    await interaction.client.user.setPresence({
      activities: data,
      status: `${status}`,
    });

    const Success = new EmbedBuilder()
      .setTitle(":white_check_mark: | Successfully Changed Status")
      .setDescription(
        `> ${
          interaction.member
        }, you have successfully changed the status of the bot. Below you can find more information about the status that is set:\n\n> ✅ **Status:** ${switcher(
          status
        )}\n> **👾 Activity:** ${
          activityType && activityName ? ` ${activityType} ${activityName}` : ""
        }\n\n> **It may take a few minutes before changes become visible.**`
      )
      .setTimestamp()
      .setAuthor({
        name: `${interaction.client.user.username}`,
        iconURL: `${interaction.client.user.displayAvatarURL()}`,
      })
      .setColor("#686c70")
    await interaction.reply({ ephemeral: true, embeds: [Success] });
  },
};
