const fs = require("fs");
const config = require("../config.json");
const { Initialization, execute } = require("../database/database");
const { dropCrystals } = require("../helpers/helper");
const {
  Events,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    let guild = client.guilds.cache.get("1055954820877533275");
    if (!guild) return console.error("Guild not found!");

    Initialization();
    setInterval(async () => {
      const now = new Date();
      const currentTimeInCEST = new Date(
        now.toLocaleString("en-US", { timeZone: "Europe/Paris" })
      );

      let data = await execute(`SELECT * FROM trainings`, []);
      for (const entry of data) {
        const {
          training_id,
          message_id,
          thread_id,
          requester_id,
          trainer_id,
          stage,
          date,
          time,
          department,
          sent,
        } = entry;
        if (!date || !time) continue;
        const dateParts = date.split("/");
        const formattedDate = `20${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
        const trainingDateTimeInCEST = new Date(`${formattedDate}T${time}:00`);

        console.log("Current time in CEST:", currentTimeInCEST.toString());
        console.log(
          "Training time in CEST:",
          trainingDateTimeInCEST.toString()
        );
        if (!trainer_id && trainingDateTimeInCEST < currentTimeInCEST) {
          await execute(`DELETE FROM trainings WHERE training_id = ?`, [
            entry.training_id,
          ]);
          let member = await guild.members.fetch(requester_id);
          let training_channel = await guild.channels.fetch(
            config.training_channel
          );
          let message = await training_channel.messages.fetch(message_id);

          const toChannel = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({
              name: `${client.user.username}`,
              iconURL: `${client.user.displayAvatarURL()}`,
            })
            .setTitle(":x: | Training Unclaimed")
            .setDescription(
              `> Dear ${member}, the training request you recently sent out has been removed as no trainer claimed the request, and the set time and date have been reached.\n\n> Feel free to use */reqtraining* to request a new training.`
            )
            .setFooter({ text: `Training Request - Not Replied` });
          await member.send({ embeds: [toChannel] });
          const action = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("claim")
              .setEmoji("✅")
              .setLabel("Claim")
              .setStyle(ButtonStyle.Success)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("send_dm")
              .setEmoji("💬")
              .setLabel("Send DM")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true)
          );
          const newEmbed = EmbedBuilder.from(message.embeds[0]).setTitle(
            "❌ | Request Not Claimed In Time"
          );
          await message.edit({ components: [action], embeds: [newEmbed] });
          continue;
        }

        const thread = await guild.channels.cache.get(thread_id);

        if (!thread || !thread.isThread()) continue;
        console.log(sent);
        if (sent == 1) continue;

        const thirtyMinutesBefore = new Date(
          trainingDateTimeInCEST.getTime() - 30 * 60 * 1000
        );
        console.log(thirtyMinutesBefore.getTime());
        console.log(currentTimeInCEST.getTime());
        console.log(trainer_id);
       
        if (
          trainer_id &&
          currentTimeInCEST.getTime() >= thirtyMinutesBefore.getTime()
        
        ) {
         
          const unixTimestamp = Math.floor(
            trainingDateTimeInCEST.getTime() / 1000
          );

          await thread.send({
            content: `<@${entry.requester_id}>, <@${trainer_id}>`,
            embeds: [
              {
                title: "🚨 | Training Reminder",
                description: `> This is a reminder for the upcoming training scheduled at <t:${unixTimestamp}:F>.\n\n> Be prepared! It starts in less than 30 minutes!`,
              },
            ],
          });
          await execute(`UPDATE trainings set sent = ? WHERE training_id = ?`, [
            true,
            entry.training_id,
          ]);
        }
      }
    }, 1 * 60 * 1000);
  },
};
