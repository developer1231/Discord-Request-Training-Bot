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
  if (interaction.isButton()) {
    if (interaction.customId === "catch_star") {
      let userData = await execute(`SELECT * FROM users WHERE member_id = ?`, [
        interaction.member.id,
      ]);
      let starData = await execute(`SELECT * FROM stars WHERE message_id = ?`, [
        interaction.message.id,
      ]);
      if (starData.length == 0) {
        return interaction.reply({
          ephemeral: true,
          content: `> :x: This star already drifted away.... **You cannot catch the star anymore! Please be on the lookout for new stars!**`,
        });
      }
      let triesData = await execute(
        `SELECT * FROM tries WHERE member_id = ? AND star_id = ?`,
        [interaction.member.id, starData[0].id]
      );
      if (triesData.length > 0) {
        let dropEmbed = new EmbedBuilder()
          .setTitle("❌ | Already Caught!")
          .setDescription(
            `> You already caught this star before and therefore cannot catch it again.\n> Please view your profile using */profile*.`
          )
          .setTimestamp()
          .setAuthor({
            name: `${interaction.client.user.username}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          })
          .setColor("#6488EA");
        return interaction.reply({ ephemeral: true, embeds: [dropEmbed] });
      }
      if (userData.length == 0) {
        await execute(
          `INSERT INTO users (member_id, points, stars_caught) VALUES (?, ?, ?)`,
          [interaction.member.id, 0, 0]
        );
      }
      await execute(`INSERT INTO tries (member_id, star_id) VALUES (?, ?)`, [
        interaction.member.id,
        starData[0].id,
      ]);
      userData = await execute(`SELECT * FROM users WHERE member_id = ?`, [
        interaction.member.id,
      ]);
      let old_caught = userData[0].stars_caught;
      let old_points = userData[0].points;
      await execute(
        `UPDATE users SET stars_caught = ?, points = ? WHERE member_id = ?`,
        [
          Number(old_caught) + 1,
          old_points + starData[0].star_drop_amount,
          interaction.member.id,
        ]
      );
      let dropEmbed = new EmbedBuilder()
        .setTitle("✅ | Successfully Caught!")
        .setDescription(
          `> You have successfully caught this star and earned ${starData[0].star_drop_amount}✨\n> Please view your profile using */profile*.`
        )
        .setTimestamp()
        .setAuthor({
          name: `${interaction.client.user.username}`,
          iconURL: `${interaction.client.user.displayAvatarURL()}`,
        })
        .setColor("#6488EA");
      return interaction.reply({ ephemeral: true, embeds: [dropEmbed] });
    }
  }
});

client.login(n.token);
