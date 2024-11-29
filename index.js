const fs = require("node:fs");
const path = require("node:path");
const n = require("./config.json");
let talkedRecently = new Set();
const { isCreated, returnData } = require("./helpers/helper");

const {
  REST,
  Routes,
  ChannelType,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  AttachmentBuilder,
  Embed,
  ChannelSelectMenuBuilder,
  ChannelSelectMenuComponent,
  RoleSelectMenuBuilder,
  ThreadAutoArchiveDuration,
} = require("discord.js");
const {
  Client,
  Events,
  GatewayIntentBits,
  PermissionFlagsBits,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const {
  execute,
  checkIfbiggerThan12h,
  bumpPost,
  generatenTime,
  makeid,
  createProfile,
  viewProfileLeft,
  viewProfileRight,
  transformStars,
} = require("./database/database");
const { generateKey } = require("node:crypto");
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});
client.invites = {};
const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
client.commands = new Collection();
for (const folder of commandFolders) {
  if (fs.lstatSync("./commands/" + folder).isDirectory()) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
}

const rest = new REST().setToken(n.token);
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    const data = await rest.put(Routes.applicationCommands(n.clientid), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.guild)
    return interaction.reply({
      ephemeral: true,
      content: `> :x: This command can only be used in guilds, and not DMs.`,
    });

  let command = client.commands.get(interaction.commandName);
  if (interaction.isCommand()) {
    command.execute(interaction);
  }
  if (interaction.isAutocomplete()) {
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }
    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  }
  if (interaction.isModalSubmit()) {
    let data = await execute(`SELECT * FROM trainings WHERE trainer_id = ?`, [
      interaction.member.id,
    ]);
    if (interaction.customId.startsWith("start-")) {
      let channel = interaction.guild.channels.cache.find(
        (r) => r.id === n.admin_channel
      );
      let message_id = interaction.customId.split("-")[1];
      data = await execute(`SELECT * FROM trainings WHERE message_id = ?`, [
        message_id,
      ]);
      let member = await interaction.guild.members.cache.get(
        data[0].requester_id
      );
      let modal_data = interaction.fields.getTextInputValue("send_dm");
      const adminMessage = new EmbedBuilder()
        .setColor("#686c70")
        .setAuthor({
          name: `${interaction.client.user.username}`,
          iconURL: `${interaction.client.user.displayAvatarURL()}`,
        })
        .setTitle("⚠️ | Admin sent a DM")
        .setDescription(
          `> Dear Administrators,\n> admin ${interaction.member} (${interaction.member.id}) has sent a dm to <@${data[0].requester_id}> (${data[0].requester_id}).\n> Please view the message below:\n\n\`\`\`${modal_data}\`\`\``
        )
        .setFooter({ text: `Training Request - DM` });
      channel.send({ embeds: [adminMessage] });
      const editor = new EmbedBuilder()
        .setColor("#686c70")
        .setAuthor({
          name: `${interaction.client.user.username}`,
          iconURL: `${interaction.client.user.displayAvatarURL()}`,
        })
        .setTitle("💬 | New incoming DM")
        .setDescription(
          `> Dear <@${data[0].requester_id}>, ${interaction.member} has sent you a DM regarding your training request you recently sent.\n> Please check the details down below:\n\`\`\`${modal_data}\`\`\``
        )
        .setFooter({ text: `Training Request - DM` });
      await member.send({ embeds: [editor] });
      await interaction.reply({
        ephemeral: true,
        content: `> :white_check_mark: Successfully sent this user a DM.`,
      });
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === "unclaim_channel") {
      await interaction.reply({
        ephemeral: true,
        content: `> :white_check_mark: Successfully unclaimed the training request.`,
      });
      let userData = await execute(
        `SELECT * FROM trainings WHERE thread_id = ?`,
        [interaction.channel.id]
      );
      const dateParts = userData[0].date.split("/");
      const formattedDate = `20${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
      const trainingDateTime = new Date(
        `${formattedDate}T${userData[0].time}:00`
      );
      const unixTimestamp = Math.floor(trainingDateTime.getTime() / 1000);
      let member = await interaction.guild.members.fetch(
        userData[0].requester_id
      );
      const toMember = new EmbedBuilder()
        .setColor("#686c70")
        .setAuthor({
          name: `${interaction.client.user.username}`,
          iconURL: `${interaction.client.user.displayAvatarURL()}`,
        })
        .setTitle(":x: | Training Unclaimed")
        .setDescription(
          `> Dear ${member}, recently ${interaction.member} claimed your training but they **Unclaimed** your training again. We sent the notification to the training team and we ask you to be patient until another trainer claims your request.`
        )
        .setFooter({
          text: `Training Request - Questions`,
        });
      await member.send({ embeds: [toMember] });
      const toChannel = new EmbedBuilder()
        .setColor("#686c70")
        .setAuthor({
          name: `${interaction.client.user.username}`,
          iconURL: `${interaction.client.user.displayAvatarURL()}`,
        })
        .setTitle("💬 | Incoming Training Request")
        .setDescription(
          `> A member has requested a training. Please view the details down below:\n` +
            `> **Status:** 🔴 (Unclaimed)\n` +
            `### 👤 User Details\n` +
            `> ${member} - (${member.id})\n` +
            `### 💬 Request Details\n` +
            `> **Stage:** ${userData[0].stage}\n` +
            `> **Date and Time:** <t:${unixTimestamp}:F>\n` + // Full date and time format
            `> **Department:** ${userData[0].department}\n\n` +
            `> Interested? Click on the **Claim** button below.\n` +
            `> Want to send the requester a message? Simply click on the **Send DM** button below.`
        )
        .setFooter({
          text: `Training Request - Questions`,
        });

      const trainingChannel = interaction.guild.channels.cache.get(
        n.training_channel
      );

      if (trainingChannel) {
        const action = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("claim")
            .setEmoji("✅")
            .setLabel("Claim")
            .setStyle(ButtonStyle.Success)
            .setDisabled(false),
          new ButtonBuilder()
            .setCustomId("send_dm")
            .setEmoji("💬")
            .setLabel("Send DM")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false)
        );
        let message = await trainingChannel.messages.fetch(
          userData[0].message_id
        );
        let thread_id = await interaction.guild.channels.fetch(
          userData[0].thread_id
        );

        await message.edit({
          embeds: [toChannel],
          components: [action],
        });
        await execute(
          `UPDATE trainings SET thread_id = ?, trainer_id = ?, sent = ? WHERE thread_id =?`,
          [null, null, null, interaction.channel.id]
        );
        await thread_id.delete();
      }
    }
    if (interaction.customId === "send_dm") {
      let data = await execute(`SELECT * FROM trainings WHERE message_id = ?`, [
        interaction.message.id,
      ]);
      const modal = new ModalBuilder()
        .setCustomId(`start-${interaction.message.id}`)
        .setTitle("Send a DM");

      const favoriteColorInput = new TextInputBuilder()
        .setCustomId("send_dm")
        .setLabel("Enter the message to send")
        .setStyle(TextInputStyle.Paragraph);

      const firstActionRow = new ActionRowBuilder().addComponents(
        favoriteColorInput
      );
      modal.addComponents(firstActionRow);
      await interaction.showModal(modal);
    }
    if (interaction.customId === "delete_channel") {
      let data = await execute(`SELECT * FROM trainings WHERE thread_id = ?`, [
        interaction.channel.id,
      ]);
      if (data[0].trainer_id !== interaction.member.id) {
        return interaction.reply({
          ephemeral: true,
          content: `> :x: You cannot close the channel as it's tied to <@${data[0].trainer_id}>, which is the trainer assigned to this channel.`,
        });
      }

      interaction.reply({
        content: `> :white_check_mark: The channel has successfully been closed by ${interaction.member}. The channel will be deleted in exactly **30s**.`,
      });
      setTimeout(async () => {
        await execute(`DELETE FROM trainings WHERE thread_id = ?`, [
          interaction.channel.id,
        ]);
        interaction.channel.delete();
      }, 30000);
    }
    if (interaction.customId === "claim") {
      let training_channel = interaction.guild.channels.cache.get(
        n.training_channel
      );
      let data = await execute(`SELECT * FROM trainings WHERE message_id = ?`, [
        interaction.message.id,
      ]);
      await execute(
        `UPDATE trainings SET trainer_id = ? WHERE message_id = ?`,
        [interaction.member.id, interaction.message.id]
      );

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
      const dateParts = data[0].date.split("/"); // Assuming DD/MM/YY format
      const formattedDate = `20${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // YYYY-MM-DD
      const trainingDateTime = new Date(`${formattedDate}T${data[0].time}:00`); // Combine date and time
      const unixTimestamp = Math.floor(trainingDateTime.getTime() / 1000); // Convert to Unix timestamp

      const editor = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({
          name: `${interaction.client.user.username}`,
          iconURL: `${interaction.client.user.displayAvatarURL()}`,
        })
        .setTitle("✅ | Training Request Accepted")
        .setDescription(
          `> A member has requested a training. Please view the details down below:\n` +
            `> **Status:** 🟢 (Claimed)\n` +
            `> **Claimer:** ${interaction.member} (${interaction.member.id})\n` +
            `> **Thread Created?** Yes.\n` +
            `### 👤 User Details\n` +
            `> - ${interaction.member} - (${interaction.member?.user.id})\n` +
            `### Request Details\n` +
            `> **Stage:** ${data[0].stage}\n` +
            `> **Date:** <t:${unixTimestamp}:D>\n` + // Displays full date (e.g., November 26, 2024)
            `> **Time:** <t:${unixTimestamp}:T>\n` + // Displays full time (e.g., 21:20)
            `> **Department:** ${data[0].department}\n\n` +
            `> Interested? Click on the **Claim** button below.\n` +
            `> Want to send the requester a message? Simply click on the **Send DM** button below.`
        )
        .setFooter({ text: `Training Request - Questions` });

      await interaction.message.edit({
        embeds: [editor],
        components: [action],
      });
      const thread = await training_channel.threads.create({
        name: `${interaction.member}-${data[0].requester_id}`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek, // Auto-archive after 1 hour of inactivity
        type: ChannelType.PrivateThread, // Ensure it's a private thread
        reason: "Training thread",
      });
      await interaction.reply({
        ephemeral: true,
        content: `> :white_check_mark: Successfully accepted the training request. Please visit the private channel with the trainee at ${thread}.`,
      });
      await execute(`UPDATE trainings SET thread_id = ? WHERE message_id = ?`, [
        thread.id,
        interaction.message.id,
      ]);
      const action2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("delete_channel")
          .setEmoji("🗑️")
          .setLabel("Delete Channel")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("unclaim_channel")
          .setEmoji("❌")
          .setLabel("Unclaim Training")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(false)
      );
      let z = await thread.send({
        components: [action2],
        content: `${interaction.member}, <@${data[0].requester_id}>, welcome to this thread! Here you can talk together and give/receive training. Once done, please click on the **Delete Channel** button that is attached to this message.\n\n> **Note**, only ${interaction.member} is allowed to close the channel.`,
      });
      await z.pin();

      // Step 2: Add two users to the thread by their IDs
      const userIds = [interaction.member.id, data[0].requester_id, n.owner_id];
      for (const userId of userIds) {
        await thread.members.add(userId);
      }

      const toMember = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({
          name: `${interaction.client.user.username}`,
          iconURL: `${interaction.client.user.displayAvatarURL()}`,
        })
        .setTitle("✅ | Training Request Accepted")
        .setDescription(
          `> Dear ${interaction.member}, someone has accepted your training request. Please view the confirmation details below:\n` +
            `> **Status:** 🟢 (Claimed)\n` +
            `> **Claimer:** ${interaction.member} (${interaction.member.id})\n` +
            `### 👤 User Details\n` +
            `> - ${interaction.member} - (${interaction.member?.user.id})\n` +
            `### Request Details\n` +
            `> **Stage:** ${data[0].stage}\n` +
            `> **Date:** <t:${unixTimestamp}:D>\n` + // Full date format
            `> **Time:** <t:${unixTimestamp}:T>\n` + // Full time format
            `> **Department:** ${data[0].department}\n\n` +
            `> A new private thread has been created between you and ${interaction.member}. Please visit this thread here: ${thread}.`
        )
        .setFooter({ text: `Training Request - Questions` });
      let member = await interaction.guild.members.cache.get(
        data[0].requester_id
      );
      await member.send({ embeds: [toMember] });
    }
  }
});

client.login(n.token);
