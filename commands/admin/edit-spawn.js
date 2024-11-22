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
    .setName("edit-spawn")
    .setDescription(`Edit spawn star image`)

    .addAttachmentOption((option) =>
      option
        .setName("image")
        .setDescription("The image of the star")
        .setRequired(true)
    ),

  async execute(interaction) {
    let image = interaction.options.getAttachment("image");
    const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
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
    }
    config.image = image.url;
    fs.writeFileSync("./config.json", JSON.stringify(config), (err) => {
      if (err) console.log(err);
    });
    const Embed = new EmbedBuilder()
      .setTitle(":white_check_mark: | Image Updated")
      .setDescription(
        `> The spawn image has successfully been updated. It will show the changes next time.`
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
