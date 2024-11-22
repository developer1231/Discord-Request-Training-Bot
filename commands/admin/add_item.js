"use strict";
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
    .setName("info")
    .setDescription(`Show bot information`),
  async execute(interaction) {
    // general information
    const botName = client.user.username;
    const botTag = client.user.tag;
    const botId = client.user.id;
    const botAvatar = client.user.displayAvatarURL();
    const botCreatedAt = client.user.createdAt;

    // Statistics
    const serverCount = client.guilds.cache.size;
    const userCount = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    const channelCount = client.channels.cache.size;
    const commandCount = client.commands.size;

    // Runtime/Performance
    const botUptime = process.uptime();
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    const ping = client.ws.ping;

    // Version Information
    const nodeVersion = process.version;
    const discordJsVersion = require("discord.js").version;
    const botVersion = require("./package.json").version;

    // Owner/Developer Information
    const botOwner = "owner_tag";
    const botOwnerId = "owner_id";

    // Hosting Information
    const hostedOn =
      "**Main Node:**\n> Rack 3 - Node 21 - Germany (Dusseldorf)\n> **Backup Node(s):**\n> - Rack 3 - Node 13 - Germany (Dusseldorf)\n> - Rack 3 - Node 21 - Germany (Dusseldorf)\n - Rack 8 - France (Lyonne).";
    const platform = process.platform;

    let botInfoEmbed = new EmbedBuilder()
      .setTitle(`${botName} |  Bot Information`)
      .setThumbnail(botAvatar)
      .setColor("Red")
      .addFields(
        {
          name: "🤖 Bot Details",
          value: `**Bot ID:** ${botId}\n> **Bot Name:** ${botName}\n> **Bot Tag:** ${botTag}`,
          inline: true,
        },
        { name: "🌐 Servers", value: `${serverCount}`, inline: true },
        { name: "👤 Users", value: `${userCount}`, inline: true },
        { name: "📢 Channels", value: `${channelCount}`, inline: true },
        {
          name: "🕕 Uptime",
          value: `${Math.floor(botUptime / 60)} minutes`,
          inline: true,
        },
        { name: "🛜 Ping", value: `${ping} ms`, inline: true },
        {
          name: "📈 eMemory Usage",
          value: `${memoryUsage.toFixed(2)} MB`,
          inline: true,
        },
        { name: "📍 Node.js Version", value: nodeVersion, inline: true },
        {
          name: "📍 Discord.js Version",
          value: discordJsVersion,
          inline: true,
        },
        {
          name: "🖥️ Hosting Information",
          value: `**Hosted on:** ${hostedOn}\n> **Hosting platform:** ${platform}`,
          inline: true,
        },
        {
          name: "🎯 Owner Details",
          value: `**Owner ID:** ${botOwnerId}\n> **Owner Tag:** ${botOwner}`,
          inline: true,
        }
      )
      .setFooter({ text: `🤖 | /info` })
      .setTimestamp();
    await interaction.reply({ ephemeral: true, embeds: [botInfoEmbed] });
  },
};
