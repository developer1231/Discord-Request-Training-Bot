const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const fs = require("fs");
const n = require("../../config.json");
const { execute, makeid } = require("../../database/database");
const { requestTraining } = require("../../helpers/helper");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("reqtraining")
    .setDescription(`Request a training`),

  async execute(interaction) {
    requestTraining(interaction, 1, makeid(5));
  },
};
