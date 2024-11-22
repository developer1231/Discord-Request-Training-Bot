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
    .setName("edit-item")
    .setDescription(`Edit an item`)
    .addStringOption((option) =>
      option
        .setName("old-name")
        .setDescription("The old name of the item")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("new-name")
        .setDescription("The new name of the item")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option
        .setName("new-price")
        .setDescription("The new amount of stardust this costs")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option
        .setName("new-stock")
        .setDescription("The new stock of this item")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("new-description")
        .setDescription("The new description of the item")
        .setRequired(false)
    )
    .addAttachmentOption((option) =>
      option
        .setName("new-image")
        .setDescription("The new image of the item")
        .setRequired(false)
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
    let oldName = interaction.options.getString("old-name");
    let newName = interaction.options.getString("new-name");
    let newPrice = interaction.options.getNumber("new-price");
    let newStock = interaction.options.getNumber("new-stock");
    let newDescription = interaction.options.getString("new-description");
    let newImage = interaction.options.getAttachment("new-image");
    let shopData = await execute(`SELECT * FROM shop where item_name = ?`, [
      oldName,
    ]);
    console.log(shopData);
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
    if (newPrice) {
      console.log(shopData[0].id);
      console.log("yes");
      if (newPrice < 0) {
        const Embed = new EmbedBuilder()
          .setTitle(":x: | Invalid Pricing")
          .setDescription(
            `> Your entered price **(${price})** is invalid. Prices must be bigger than 0.`
          )
          .setTimestamp()
          .setAuthor({
            name: `${interaction.client.user.username}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          })
          .setColor("#6488EA");
        return interaction.reply({ ephemeral: true, embeds: [Embed] });
      }
      await execute(`UPDATE shop SET item_price = ? WHERE id = ?`, [
        newPrice,
        shopData[0].id,
      ]);
    }
    if (newStock) {
      if (newStock < 0) {
        const Embed = new EmbedBuilder()
          .setTitle(":x: | Invalid Stock")
          .setDescription(
            `> Your entered stock **(${stock})** is invalid. Stock quantities must be bigger than 0.`
          )
          .setTimestamp()
          .setAuthor({
            name: `${interaction.client.user.username}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          })
          .setColor("#6488EA");
        return interaction.reply({ ephemeral: true, embeds: [Embed] });
      }
      await execute(`UPDATE shop SET stock = ? WHERE id = ?`, [
        newStock,
        shopData[0].id,
      ]);
    }
    if (newDescription) {
      await execute(`UPDATE shop SET item_description = ? WHERE id = ?`, [
        newDescription,
        shopData[0].id,
      ]);
    }
    if (newImage) {
      await execute(`UPDATE shop SET item_image = ? WHERE id = ?`, [
        newImage.url,
        shopData[0].id,
      ]);
    }
    if (newName) {
      await execute(`UPDATE shop SET item_name = ? WHERE id = ?`, [
        newName,
        shopData[0].id,
      ]);
    }
    setTimeout(() => {
      const Embed = new EmbedBuilder()
        .setTitle(":white_check_mark: | Successfully Updated")
        .setDescription(
          `> You have successfully updated the item. Please use */shop* and */item-desc* to view more information about this item.`
        )
        .setTimestamp()
        .setAuthor({
          name: `${interaction.client.user.username}`,
          iconURL: `${interaction.client.user.displayAvatarURL()}`,
        })
        .setColor("#6488EA");
      return interaction.reply({ ephemeral: true, embeds: [Embed] });
    }, 1000);
  },
};
