import { execute, makeid } from "../database/database";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  Interaction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  ComponentType,
  TextChannel,
  CacheType,
  GuildChannel,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  GuildTextBasedChannel,
  ButtonInteraction,
} from "discord.js";
import * as fs from "fs";
import * as config from "../config.json";
const enum TrainingPaginator {
  INTRODUCTION = 1,
  Q1 = 2,
  Q2 = 3,
  Q3 = 4,
}
export async function requestTraining(
  interaction: CommandInteraction,
  page: TrainingPaginator,
  trainingID: string
): Promise<void> {
  if (page === TrainingPaginator.INTRODUCTION) {
    await execute(
      `INSERT INTO trainings (training_id, message_id, thread_id, requester_id, trainer_id, stage, date, time, department, sent) VALUES (?, ?, ?, ?, ?, ?, ? ,? ,?, ?)`,
      [
        trainingID,
        null,
        null,
        (interaction as CommandInteraction).member?.user.id,
        null,
        null,
        null,
        null,
        null,
        false,
      ]
    );
    const introEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor("#686c70")
      .setAuthor({
        name: `${interaction.client.user.username}`,
        iconURL: `${interaction.client.user.displayAvatarURL()}`,
      })
      .setTitle("💬 | Training Request - Introduction")
      .setDescription(
        `> Dear ${interaction.member}, so you are interested in sending out a training request? Well, you are at the right place.\n> In exactly **15** seconds, this embed will be edited and reveal the first question to help you on your way! In total, there are **5** questions, which we will be sending along your training request. This way the trainers directly know what you need!`
      )
      .setFooter({ text: `Training Request - Questions` });
    await interaction.reply({
      ephemeral: true,
      embeds: [introEmbed],
    });
    setTimeout(async () => {
      await requestTraining(interaction, TrainingPaginator.Q1, trainingID);
    }, 15000);
  } else if (page == TrainingPaginator.Q1) {
    const question1Embed: EmbedBuilder = new EmbedBuilder()
      .setColor("#686c70")
      .setAuthor({
        name: `${interaction.client.user.username}`,
        iconURL: `${interaction.client.user.displayAvatarURL()}`,
      })
      .setTitle("💬 | Training Request - Stage")
      .setDescription(
        `Dear ${interaction.member}, please enter your **Stage** from the dropdown below.\n\n> - **⚠️ Disclaimer**: You have exactly **60s** to answer.`
      )
      .setFooter({ text: `Training Request - Questions` });
    const dropdown = new StringSelectMenuBuilder()
      .setCustomId("stage-select") // Custom ID for the select menu
      .setPlaceholder("Select your stage") // Placeholder text
      .addOptions([
        {
          label: "Stage 2",
          description: "You are in stage 2",
          value: "stage_2",
        },
        {
          label: "Stage 3",
          description: "You are in stage 3",
          value: "stage_3",
        },
        {
          label: "Stage 4",
          description: "You are in stage 4 (Flight Attendant/Captain Only)",
          value: "stage_4",
        },
      ]);

    const row: ActionRowBuilder<StringSelectMenuBuilder> =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(dropdown);

    const message = await interaction.editReply({
      embeds: [question1Embed],
      components: [row],
    });

    try {
      const filter = (i: StringSelectMenuInteraction) =>
        i.customId === "stage-select" && i.user.id === interaction.user.id;

      const collector = (
        interaction.channel as TextChannel
      )?.createMessageComponentCollector({
        filter,
        componentType: ComponentType.StringSelect,
        time: 60000,
      });

      collector?.on("collect", async (i: StringSelectMenuInteraction) => {
        const selectedValues = i.values[0];
        await i.deferUpdate();
        collector.stop();

        if (selectedValues === "stage_2") {
          await execute(
            `UPDATE trainings SET stage = ? WHERE training_id = ?`,
            ["Stage 2", trainingID]
          );
        } else if (selectedValues === "stage_3") {
          await execute(
            `UPDATE trainings SET stage = ? WHERE training_id = ?`,
            ["Stage 3", trainingID]
          );
        } else if (selectedValues === "stage_4") {
          await execute(
            `UPDATE trainings SET stage = ? WHERE training_id = ?`,
            ["Stage 4", trainingID]
          );
        } else {
          await execute(
            `UPDATE trainings SET stage = ? WHERE training_id = ?`,
            ["Stage FA", trainingID]
          );
        }
        await requestTraining(interaction, TrainingPaginator.Q2, trainingID);
      });

      collector?.on("end", async (collected, reason) => {
        if (reason === "time" && collected.size == 0) {
          await execute(`DELETE FROM trainings WHERE training_id = ?`, [
            trainingID,
          ]);
          const tooLate: EmbedBuilder = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({
              name: `${interaction.client.user.username}`,
              iconURL: `${interaction.client.user.displayAvatarURL()}`,
            })
            .setTitle(":x: | Late Reply")
            .setDescription(
              `Dear ${interaction.member}, you did not answer in **60s**. Hence the input will be closed.`
            )
            .setFooter({ text: `Training Request - Questions` });
          await interaction.editReply({
            components: [],
            embeds: [tooLate],
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  } else if (TrainingPaginator.Q2 === page) {
    console.log("test");
    const question1Embed: EmbedBuilder = new EmbedBuilder()
      .setColor("#686c70")
      .setAuthor({
        name: `${interaction.client.user.username}`,
        iconURL: `${interaction.client.user.displayAvatarURL()}`,
      })
      .setTitle("💬 | Training Request - Date & Time")
      .setDescription(
        `Dear ${interaction.member}, please enter the **Date and Time:** in format (YY/MM/DD) and (15:05) in GMT respectively.\n\n> - **⚠️ Disclaimer**: You have exactly **60s** to answer.\n> - Click on the **Enter Date & Time** button below to open the modal.`
      )
      .setFooter({ text: `Training Request - Questions` });
    const modalButton = new ButtonBuilder()
      .setCustomId("open-date-modal")
      .setLabel("Enter Date & Time")
      .setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      modalButton
    );
    await interaction.editReply({
      embeds: [question1Embed],
      components: [actionRow],
    });
    const filter1 = (i: ButtonInteraction) =>
      i.customId === "open-date-modal" && i.user.id === interaction.user.id;

    const collector = (
      interaction.channel as TextChannel
    )?.createMessageComponentCollector({
      filter: filter1,
      componentType: ComponentType.Button,
      time: 60000,
    });

    collector?.on("collect", async (i: StringSelectMenuInteraction) => {
      collector.stop();
      if (i.customId === "open-date-modal") {
        const modal = new ModalBuilder()
          .setCustomId("date-modal")
          .setTitle("Enter Date & Time");

        const dateInput = new TextInputBuilder()
          .setCustomId("date-input")
          .setLabel("Enter date (YY/MM/DD)")
          .setPlaceholder("24/11/22")
          .setStyle(TextInputStyle.Short);
        const timeInput = new TextInputBuilder()
          .setCustomId("time-input")
          .setLabel("Enter time in GMT (HH:MM)")
          .setPlaceholder("15:05")
          .setStyle(TextInputStyle.Short);
        const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(
          dateInput
        );
        const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
          timeInput
        );

        modal.addComponents(row1, row2);

        await i.showModal(modal);

        const filter = (i: any) =>
          i.customId === "date-modal" && i.user.id === interaction.user.id;

        interaction
          .awaitModalSubmit({ filter, time: 60000 })
          .then(async (modalInteraction) => {
            const dateRegex = /^\d{2}\/\d{2}\/\d{2}$/;

            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

            const enteredDate =
              modalInteraction.fields.getTextInputValue("date-input");
            const enteredTime =
              modalInteraction.fields.getTextInputValue("time-input");

            if (!dateRegex.test(enteredDate)) {
              await modalInteraction.reply({
                ephemeral: true,
                content:
                  "> :x: Invalid date format. Please use `YY/MM/DD` (e.g., 24/11/22). Please use */reqtraining* again.",
              });
              await execute(`DELETE FROM trainings WHERE training_id = ?`, [
                trainingID,
              ]);
              return;
            }

            if (!timeRegex.test(enteredTime)) {
              await modalInteraction.reply({
                ephemeral: true,
                content:
                  "> :x: Invalid time format. Please use `HH:MM` in 24-hour format (e.g., 15:05). Please use */reqtraining* again.",
              });
              await execute(`DELETE FROM trainings WHERE training_id = ?`, [
                trainingID,
              ]);
              return;
            }
            await execute(
              `UPDATE trainings SET date = ?, time = ? WHERE training_id = ?`,
              [enteredDate, enteredTime, trainingID]
            );
            await modalInteraction.deferUpdate();

            await requestTraining(
              interaction,
              TrainingPaginator.Q3,
              trainingID
            );
          })
          .catch(async (error) => {
            console.log(error);

            const tooLate: EmbedBuilder = new EmbedBuilder()
              .setColor("Red")
              .setAuthor({
                name: `${interaction.client.user.username}`,
                iconURL: `${interaction.client.user.displayAvatarURL()}`,
              })
              .setTitle(":x: | Late Reply")
              .setDescription(
                `Dear ${interaction.member}, you did not answer in **60s**. Hence the input will be closed.`
              )
              .setFooter({ text: `Training Request - Questions` });
            await interaction.editReply({
              components: [],
              embeds: [tooLate],
            });
          });
      }
    });
    collector?.on("end", async (collected, reason) => {
      console.log();
      if (reason === "time" && collected.size == 0) {
        await execute(`DELETE FROM trainings WHERE training_id = ?`, [
          trainingID,
        ]);
        const tooLate: EmbedBuilder = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: `${interaction.client.user.username}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          })
          .setTitle(":x: | Late Reply")
          .setDescription(
            `Dear ${interaction.member}, you did not answer in **60s**. Hence the input will be closed.`
          )
          .setFooter({ text: `Training Request - Questions` });
        await interaction.editReply({
          components: [],
          embeds: [tooLate],
        });
      }
    });
  } else if (TrainingPaginator.Q3 === page) {
    const question3Embed: EmbedBuilder = new EmbedBuilder()
      .setColor("#686c70")
      .setAuthor({
        name: `${interaction.client.user.username}`,
        iconURL: `${interaction.client.user.displayAvatarURL()}`,
      })
      .setTitle("💬 | Training Request")
      .setDescription(
        `Dear ${interaction.member}, please enter your **Department** from the dropdown below.\n\n> - **⚠️ Disclaimer**: You have exactly **60s** to answer.`
      )
      .setFooter({ text: `Training Request - Questions` });

    const dropdown = new StringSelectMenuBuilder()
      .setCustomId("department-select")
      .setPlaceholder("Select your department")
      .addOptions([
        {
          label: "Captain",
          description: "Captain Department",
          value: "captain",
        },
        {
          label: "First Officer",
          description: "First Officer Department",
          value: "first_officer",
        },
        {
          label: "Flight Attendant",
          description: "Flight Attendant Department",
          value: "flight_attendant",
        },
        {
          label: "Airport Staff",
          description: "Airport Staff Department",
          value: "airport_staff",
        },
        {
          label: "Ground Crew",
          description: "Ground Crew Department",
          value: "ground_crew",
        },
      ]);

    const row: ActionRowBuilder<StringSelectMenuBuilder> =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(dropdown);

    const message = await interaction.editReply({
      embeds: [question3Embed],
      components: [row],
    });

    try {
      const filter = (i: StringSelectMenuInteraction) =>
        i.customId === "department-select" && i.user.id === interaction.user.id;

      const collector = (
        interaction.channel as TextChannel
      )?.createMessageComponentCollector({
        filter,
        componentType: ComponentType.StringSelect,
        time: 60000,
      });

      collector?.on("collect", async (i: StringSelectMenuInteraction) => {
        const selectedValues = i.values[0];
        let Captaindata = await execute(
          `select * from trainings WHERE requester_id = ? AND trainer_id IS NULL AND department = ?`,
          [interaction?.member?.user.id, "Captain"]
        );
        let fodata = await execute(
          `select * from trainings WHERE requester_id = ? AND trainer_id IS NULL AND department = ?`,
          [interaction?.member?.user.id, "First Officer"]
        );
        let fadata = await execute(
          `select * from trainings WHERE requester_id = ? AND trainer_id IS NULL AND department = ?`,
          [interaction?.member?.user.id, "Flight Attendant"]
        );
        let asdata = await execute(
          `select * from trainings WHERE requester_id = ? AND trainer_id IS NULL AND department = ?`,
          [interaction?.member?.user.id, "Airport Staff"]
        );
        let gcdata = await execute(
          `select * from trainings WHERE requester_id = ? AND trainer_id IS NULL AND department = ?`,
          [interaction?.member?.user.id, "Ground Crew"]
        );
        await i.deferUpdate();
        if (
          Captaindata.length > 0 ||
          fodata.length > 0 ||
          fadata.length > 0 ||
          asdata.length > 0 ||
          gcdata.length > 0
        ) {
          const toChannel = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({
              name: `${interaction.client.user.username}`,
              iconURL: `${interaction.client.user.displayAvatarURL()}`,
            })
            .setTitle(":x: | Already Sent a Request")
            .setDescription(
              `> Dear ${interaction.member}, you have sadly already sent a request for the selected department, that has not been answered yet. Please wait until your request is answered before publishing another one for this department, or select a different department.\n> The input has been closed. Please use */reqtraining* again.`
            )
            .setFooter({ text: `Training Request - Error` });
          return interaction.editReply({
            embeds: [toChannel],
          });
        }

        if (selectedValues === "captain") {
          await execute(
            `UPDATE trainings SET department = ? WHERE training_id = ?`,
            ["Captain", trainingID]
          );
        } else if (selectedValues === "first_officer") {
          await execute(
            `UPDATE trainings SET department = ? WHERE training_id = ?`,
            ["First Officer", trainingID]
          );
        } else if (selectedValues === "flight_attendant") {
          await execute(
            `UPDATE trainings SET department = ? WHERE training_id = ?`,
            ["Flight Attendant", trainingID]
          );
        } else if (selectedValues === "airport_staff") {
          await execute(
            `UPDATE trainings SET department = ? WHERE training_id = ?`,
            ["Airport Staff", trainingID]
          );
        } else {
          await execute(
            `UPDATE trainings SET department = ? WHERE training_id = ?`,
            ["Ground Crew", trainingID]
          );
        }
        const sentEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor("Green")
          .setAuthor({
            name: `${interaction.client.user.username}`,
            iconURL: `${interaction.client.user.displayAvatarURL()}`,
          })
          .setTitle("✅ | Request Sent!")
          .setDescription(
            `> Dear ${interaction.member}, you have successfully filled in the training request details. The message has been sent in the training channel, and you will be notified when a trainer accepts your request.`
          )
          .setFooter({
            text: `Remember, if your training isn't accepted by the time that your training is supposed to start, the training will be automatically closed.`,
          });
        let userData = await execute(
          `SELECT * FROM trainings WHERE training_id = ?`,
          [trainingID]
        );
        const dateParts = userData[0].date.split("/");
        const formattedDate = `20${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
        const trainingDateTime = new Date(
          `${formattedDate}T${userData[0].time}:00`
        );
        const unixTimestamp = Math.floor(trainingDateTime.getTime() / 1000);

        let role_to_ping;
        if (userData[0].department == "Ground Crew") {
          role_to_ping = interaction.guild?.roles.cache.find(
            (role) => role.id === config.ground_crew_role
          );
        }
        if (userData[0].department == "Airport Staff") {
          role_to_ping = interaction.guild?.roles.cache.find(
            (role) => role.id === config.airport_staff
          );
        }
        if (userData[0].department == "Flight Attendant") {
          role_to_ping = interaction.guild?.roles.cache.find(
            (role) => role.id === config.flight_attendant
          );
        }
        if (userData[0].department == "First Officer") {
          role_to_ping = interaction.guild?.roles.cache.find(
            (role) => role.id === config.first_officer
          );
        }
        if (userData[0].department == "Captain") {
          role_to_ping = interaction.guild?.roles.cache.find(
            (role) => role.id === config.captain
          );
        }
        const toChannel: EmbedBuilder = new EmbedBuilder()
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
              `> ${interaction.member} - (${interaction.member?.user.id})\n` +
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

        const trainingChannel = interaction.guild?.channels.cache.get(
          config.training_channel
        );

        if (trainingChannel && trainingChannel.isTextBased()) {
          const action: ActionRowBuilder<ButtonBuilder> =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
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
          const textChannel = trainingChannel as TextChannel;
          const message = await textChannel.send({
            embeds: [toChannel],
            components: [action],
            content: `${role_to_ping}`,
          });
          await execute(
            `UPDATE trainings SET message_id = ? WHERE training_id = ?`,
            [message.id, trainingID]
          );
          await interaction.editReply({ embeds: [sentEmbed], components: [] });
        }
      });

      collector?.on("end", async (collected, reason) => {
        console.log("department");
        if (reason === "time" && collected.size == 0) {
          await execute(`DELETE FROM trainings WHERE training_id = ?`, [
            trainingID,
          ]);
          const tooLate: EmbedBuilder = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({
              name: `${interaction.client.user.username}`,
              iconURL: `${interaction.client.user.displayAvatarURL()}`,
            })
            .setTitle(":x: | Late Reply")
            .setDescription(
              `Dear ${interaction.member}, you did not answer in **60s**. Hence the input will be closed.`
            )
            .setFooter({ text: `Training Request - Questions` });
          await interaction.editReply({
            components: [],
            embeds: [tooLate],
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}
