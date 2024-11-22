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
    .setName("gift")
    .setDescription(`Gift an item or currency`)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to gift the item or currency to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Currency or an Item?")
        .setRequired(true)
        .addChoices(
          { name: `Currency`, value: `currency` },
          { name: `Item`, value: `item` }
        )
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setAutocomplete(true)
        .setDescription("The new name of the item")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option
        .setName("currency")
        .setDescription("The currency amount to gift")
        .setRequired(false)
    ),

  async autocomplete(interaction) {
    let names = await Promise.all(
      (
        await execute(`SELECT * FROM inventory WHERE member_id = ?`, [
          interaction.member.id,
        ])
      ).map(async (x) => {
        let data = await execute(`SELECT * FROM shop WHERE id = ?`, [
          x.item_id,
        ]);
        console.log(data);
        return data[0].item_name;
      })
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
    let type = interaction.options.getString("type");
    let name = interaction.options.getString("item");
    let receiver = interaction.options.getMember("user");
    let currency = interaction.options.getNumber("currency");

    let userData = await execute(`SELECT * FROM users WHERE member_id =?`, [
      interaction.member.id,
    ]);
    let receiverData = await execute(`SELECT * FROM users WHERE member_id =?`, [
      receiver.id,
    ]);
    if (receiverData.length == 0) {
      await execute(
        `INSERT INTO users (member_id, points, stars_caught) VALUES (?, ?, ?)`,
        [receiver.id, 0, 0]
      );
    }
    receiverData = await execute(`SELECT * FROM users WHERE member_id =?`, [
      receiver.id,
    ]);
    if (userData.length == 0) {
      await execute(
        `INSERT INTO users (member_id, points, stars_caught) VALUES (?, ?, ?)`,
        [interaction.member.id, 0, 0]
      );
    }
    userData = await execute(`SELECT * FROM users WHERE member_id =?`, [
      interaction.member.id,
    ]);
    if (type == "currency") {
      if (currency) {
        if (currency < 0) {
          const Embed = new EmbedBuilder()
            .setTitle(":x: | Invalid Currency")
            .setDescription(
              `> Your entered currency of **(${currency}✨)** is invalid. Gifted currencies must be bigger than 0.`
            )
            .setTimestamp()
            .setAuthor({
              name: `${interaction.client.user.username}`,
              iconURL: `${interaction.client.user.displayAvatarURL()}`,
            })
            .setColor("#6488EA");
          return interaction.reply({ ephemeral: true, embeds: [Embed] });
        }
        if (currency > userData[0].points) {
          const Embed = new EmbedBuilder()
            .setTitle(":x: | Insufficient Funds")
            .setDescription(
              `> Your entered currency of **(${currency}✨)** that you try to gift is too high for your current balance of **(${userData[0].points}✨)**.`
            )
            .setTimestamp()
            .setAuthor({
              name: `${interaction.client.user.username}`,
              iconURL: `${interaction.client.user.displayAvatarURL()}`,
            })
            .setColor("#6488EA");
          return interaction.reply({ ephemeral: true, embeds: [Embed] });
        }
        let oldUserMoney = Number(receiverData[0].points);
        // gift here
        await execute(`UPDATE users SET points = ? WHERE member_id = ?`, [
          Number(oldUserMoney) + currency,
          receiver.id,
        ]);
        await execute(`UPDATE users SET points = ? WHERE member_id = ?`, [
          Number(userData[0].points) - currency,
          interaction.member.id,
        ]);
        const Embed = new EmbedBuilder()
          .setTitle("🎉 | Gift Received")
          .setDescription(
            `> Dear ${receiver}, ${interaction.member} has just gifted you **Currency**!\n\n> **Received Currency:** ${currency}✨.\n> - Please check your new balance using */profile*.\n> - To return the favor, use */gift* to gift this member either **Items** or **Currency**!`
          )
          .setTimestamp()
          .setAuthor({
            name: `${interaction.client.user.username}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          })
          .setColor("#6488EA");
        receiver.send({ embeds: [Embed] });
        const toBack = new EmbedBuilder()
          .setTitle("🎉 | Gift Sent")
          .setDescription(
            `> Dear ${interaction.member}, you have successfully sent the gift to ${receiver}. They have also directly been notified of this gift.\n\n> **Sent Currency:** ${currency}✨.\n> - Please check your new balance using */profile*.`
          )
          .setTimestamp()
          .setAuthor({
            name: `${interaction.client.user.username}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          })
          .setColor("#6488EA");

        return interaction.reply({ ephemeral: true, embeds: [toBack] });
      } else {
        const toBack = new EmbedBuilder()
          .setTitle(":x: | Error sending gift")
          .setDescription(
            `> Dear ${interaction.member}, if you select **Currency** as type, you must fill in the **Currency** option in the slash command. Please try again.`
          )
          .setTimestamp()
          .setAuthor({
            name: `${interaction.client.user.username}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          })
          .setColor("#6488EA");

        return interaction.reply({ ephemeral: true, embeds: [toBack] });
      }
    } else {
      if (name) {
        let item_id = await execute(`SELECT * FROM shop WHERE item_name = ?`, [
          name,
        ]);
        await execute(
          `UPDATE inventory SET member_id = ? WHERE member_id = ? AND item_id = ?`,
          [receiver.id, interaction.member.id, item_id[0].id]
        );
        const Embed = new EmbedBuilder()
          .setTitle("🎉 | Gift Received")
          .setDescription(
            `> Dear ${receiver}, ${interaction.member} has just gifted you **Items**!\n\n> **Received Item:** ${name}✨.\n> - Please check your inventory using */profile*.\n> - To return the favor, use */gift* to gift this member either **Items** or **Currency**!`
          )
          .setTimestamp()
          .setAuthor({
            name: `${interaction.client.user.username}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          })
          .setColor("#6488EA");
        receiver.send({ embeds: [Embed] });
        const toBack = new EmbedBuilder()
          .setTitle("🎉 | Gift Sent")
          .setDescription(
            `> Dear ${interaction.member}, you have successfully sent the gift to ${receiver}. They have also directly been notified of this gift.\n\n> **Sent Item:** ${name}✨.\n> - Please check your new inventory using */profile*.`
          )
          .setTimestamp()
          .setAuthor({
            name: `${interaction.client.user.username}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          })
          .setColor("#6488EA");
        return interaction.reply({ ephemeral: true, embeds: [toBack] });
      } else {
        const toBack = new EmbedBuilder()
          .setTitle(":x: | Error sending gift")
          .setDescription(
            `> Dear ${interaction.member}, if you select **Item** as type, you must fill in the **name** option in the slash command. Please try again.`
          )
          .setTimestamp()
          .setAuthor({
            name: `${interaction.client.user.username}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          })
          .setColor("#6488EA");

        return interaction.reply({ ephemeral: true, embeds: [toBack] });
      }
    }
  },
};
