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
    const botName = interaction.client.user.username;
    const botTag = interaction.client.user.tag;
    const botId = interaction.client.user.id;
    const botAvatar = interaction.client.user.displayAvatarURL();
    const botCreatedAt = interaction.client.user.createdAt;

    // Statistics
    const serverCount = interaction.client.guilds.cache.size;
    const userCount = interaction.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    const channelCount = interaction.client.channels.cache.size;
    const commandCount = interaction.client.commands.size;

    // Runtime/Performance
    const botUptime = process.uptime();
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    const ping = interaction.client.ws.ping;
    console.log(ping);
    // Version Information
    const nodeVersion = process.version;
    const discordJsVersion = require("discord.js").version;
    const botVersion = "1.A2 (Alpha Version 2).";

    // Owner/Developer Information

    const botOwnerId = "430650178790490114";
    // const botOwner = interaction.guild.members.cache.find(
    //   (r) => r.id === botOwnerId
    // );

    // Hosting Information
    const hostedOn =
      "**Main Node:**\n> - Rack 3 - Node 21 - Germany (Dusseldorf)\n> **Backup Node(s):**\n> - Rack 3 - Node 13 - Germany (Dusseldorf)\n> - Rack 3 - Node 21 - Germany (Dusseldorf)\n> - Rack 8 - France (Lyonne).";
    const platform = process.platform;

    let botInfoEmbed = new EmbedBuilder()
      .setTitle(`${botName} | Bot Information`)
      .setAuthor({
        name: interaction.client.user.username,
        iconURL: botAvatar,
      })
      .setThumbnail(botAvatar)
      .setColor("#686c70")
      .setDescription(
        `
**🤖 Bot Details**
> **Bot ID:** ${botId}
> **Bot Name:** ${botName}
> **Bot Tag:** <@${botId}>

**🌐 Servers:** ${serverCount}
> **Users:** ${userCount}
> **Channels:** ${channelCount}

**🛜 Bot Statistics:**
> **Uptime:** ${Math.floor(botUptime / 60)} minutes
> **Ping:** ${ping}ms

**📈 System Information:**  
> **Memory Usage:** ${memoryUsage.toFixed(2)} MB
> **Node.js Version:** ${nodeVersion}
> **Discord.js Version:** ${discordJsVersion}

**🖥️ Hosting Information**
> ${hostedOn}
> **Hosting platform:** ${platform}

**🎯 Owner Details**
> **Owner ID:** ${botOwnerId}
> **Owner Tag:** <@${botOwnerId}>
`
      )
      .setFooter({ text: `🤖 | /info`, iconURL: botAvatar })
      .setTimestamp();

    await interaction.reply({ ephemeral: true, embeds: [botInfoEmbed] });
  },
};
