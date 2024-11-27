"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestTraining = requestTraining;
var database_1 = require("../database/database");
var discord_js_1 = require("discord.js");
var config = require("../config.json");
function requestTraining(interaction, page, trainingID) {
    return __awaiter(this, void 0, void 0, function () {
        var introEmbed, question1Embed, dropdown, row, message, filter, collector_1, question1Embed, modalButton, actionRow, filter1, collector_2, question3Embed, dropdown, row, message, filter, collector;
        var _this = this;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!(page === 1 /* TrainingPaginator.INTRODUCTION */)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, database_1.execute)("INSERT INTO trainings (training_id, message_id, thread_id, requester_id, trainer_id, stage, date, time, department, sent) VALUES (?, ?, ?, ?, ?, ?, ? ,? ,?, ?)", [
                            trainingID,
                            null,
                            null,
                            (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id,
                            null,
                            null,
                            null,
                            null,
                            null,
                            false,
                        ])];
                case 1:
                    _e.sent();
                    introEmbed = new discord_js_1.EmbedBuilder()
                        .setColor("#686c70")
                        .setAuthor({
                        name: "".concat(interaction.client.user.username),
                        iconURL: "".concat(interaction.client.user.displayAvatarURL()),
                    })
                        .setTitle("💬 | Training Request - Introduction")
                        .setDescription("> Dear ".concat(interaction.member, ", so you are interested in sending out a training request? Well, you are at the right place.\n> In exactly **15** seconds, this embed will be edited and reveal the first question to help you on your way! In total, there are **5** questions, which we will be sending along your training request. This way the trainers directly know what you need!"))
                        .setFooter({ text: "Training Request - Questions" });
                    return [4 /*yield*/, interaction.reply({
                            ephemeral: true,
                            embeds: [introEmbed],
                        })];
                case 2:
                    _e.sent();
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, requestTraining(interaction, 2 /* TrainingPaginator.Q1 */, trainingID)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 15000);
                    return [3 /*break*/, 9];
                case 3:
                    if (!(page == 2 /* TrainingPaginator.Q1 */)) return [3 /*break*/, 5];
                    question1Embed = new discord_js_1.EmbedBuilder()
                        .setColor("#686c70")
                        .setAuthor({
                        name: "".concat(interaction.client.user.username),
                        iconURL: "".concat(interaction.client.user.displayAvatarURL()),
                    })
                        .setTitle("💬 | Training Request - Stage")
                        .setDescription("Dear ".concat(interaction.member, ", please enter your **Stage** from the dropdown below.\n\n> - **\u26A0\uFE0F Disclaimer**: You have exactly **60s** to answer."))
                        .setFooter({ text: "Training Request - Questions" });
                    dropdown = new discord_js_1.StringSelectMenuBuilder()
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
                            description: "You are in stage 4",
                            value: "stage_4",
                        },
                        {
                            label: "Stage FA",
                            description: "You are in stage FA",
                            value: "stage_fa",
                        },
                    ]);
                    row = new discord_js_1.ActionRowBuilder().addComponents(dropdown);
                    return [4 /*yield*/, interaction.editReply({
                            embeds: [question1Embed],
                            components: [row],
                        })];
                case 4:
                    message = _e.sent();
                    try {
                        filter = function (i) {
                            return i.customId === "stage-select" && i.user.id === interaction.user.id;
                        };
                        collector_1 = (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.createMessageComponentCollector({
                            filter: filter,
                            componentType: discord_js_1.ComponentType.StringSelect,
                            time: 60000,
                        });
                        collector_1 === null || collector_1 === void 0 ? void 0 : collector_1.on("collect", function (i) { return __awaiter(_this, void 0, void 0, function () {
                            var selectedValues;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        selectedValues = i.values[0];
                                        return [4 /*yield*/, i.deferUpdate()];
                                    case 1:
                                        _a.sent();
                                        collector_1.stop();
                                        if (!(selectedValues === "stage_2")) return [3 /*break*/, 3];
                                        return [4 /*yield*/, (0, database_1.execute)("UPDATE trainings SET stage = ? WHERE training_id = ?", ["Stage 2", trainingID])];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 9];
                                    case 3:
                                        if (!(selectedValues === "stage_3")) return [3 /*break*/, 5];
                                        return [4 /*yield*/, (0, database_1.execute)("UPDATE trainings SET stage = ? WHERE training_id = ?", ["Stage 3", trainingID])];
                                    case 4:
                                        _a.sent();
                                        return [3 /*break*/, 9];
                                    case 5:
                                        if (!(selectedValues === "stage_4")) return [3 /*break*/, 7];
                                        return [4 /*yield*/, (0, database_1.execute)("UPDATE trainings SET stage = ? WHERE training_id = ?", ["Stage 4", trainingID])];
                                    case 6:
                                        _a.sent();
                                        return [3 /*break*/, 9];
                                    case 7: return [4 /*yield*/, (0, database_1.execute)("UPDATE trainings SET stage = ? WHERE training_id = ?", ["Stage FA", trainingID])];
                                    case 8:
                                        _a.sent();
                                        _a.label = 9;
                                    case 9: return [4 /*yield*/, requestTraining(interaction, 3 /* TrainingPaginator.Q2 */, trainingID)];
                                    case 10:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        collector_1 === null || collector_1 === void 0 ? void 0 : collector_1.on("end", function (collected, reason) { return __awaiter(_this, void 0, void 0, function () {
                            var tooLate;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(reason === "time" && collected.size == 0)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, (0, database_1.execute)("DELETE FROM trainings WHERE training_id = ?", [
                                                trainingID,
                                            ])];
                                    case 1:
                                        _a.sent();
                                        tooLate = new discord_js_1.EmbedBuilder()
                                            .setColor("Red")
                                            .setAuthor({
                                            name: "".concat(interaction.client.user.username),
                                            iconURL: "".concat(interaction.client.user.displayAvatarURL()),
                                        })
                                            .setTitle(":x: | Late Reply")
                                            .setDescription("Dear ".concat(interaction.member, ", you did not answer in **60s**. Hence the input will be closed."))
                                            .setFooter({ text: "Training Request - Questions" });
                                        return [4 /*yield*/, interaction.editReply({
                                                components: [],
                                                embeds: [tooLate],
                                            })];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    catch (e) {
                        console.log(e);
                    }
                    return [3 /*break*/, 9];
                case 5:
                    if (!(3 /* TrainingPaginator.Q2 */ === page)) return [3 /*break*/, 7];
                    console.log("test");
                    question1Embed = new discord_js_1.EmbedBuilder()
                        .setColor("#686c70")
                        .setAuthor({
                        name: "".concat(interaction.client.user.username),
                        iconURL: "".concat(interaction.client.user.displayAvatarURL()),
                    })
                        .setTitle("💬 | Training Request - Date & Time")
                        .setDescription("Dear ".concat(interaction.member, ", please enter the **Date and Time:** in format (DD/MM/YY) and (15:05) respectively.\n\n> - **\u26A0\uFE0F Disclaimer**: You have exactly **60s** to answer.\n> - Click on the **Enter Date & Time** button below to open the modal."))
                        .setFooter({ text: "Training Request - Questions" });
                    modalButton = new discord_js_1.ButtonBuilder()
                        .setCustomId("open-date-modal")
                        .setLabel("Enter Date & Time")
                        .setStyle(discord_js_1.ButtonStyle.Primary);
                    actionRow = new discord_js_1.ActionRowBuilder().addComponents(modalButton);
                    return [4 /*yield*/, interaction.editReply({
                            embeds: [question1Embed],
                            components: [actionRow],
                        })];
                case 6:
                    _e.sent();
                    filter1 = function (i) {
                        return i.customId === "open-date-modal" && i.user.id === interaction.user.id;
                    };
                    collector_2 = (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.createMessageComponentCollector({
                        filter: filter1,
                        componentType: discord_js_1.ComponentType.Button,
                        time: 60000,
                    });
                    collector_2 === null || collector_2 === void 0 ? void 0 : collector_2.on("collect", function (i) { return __awaiter(_this, void 0, void 0, function () {
                        var modal, dateInput, timeInput, row1, row2, filter;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    collector_2.stop();
                                    if (!(i.customId === "open-date-modal")) return [3 /*break*/, 2];
                                    modal = new discord_js_1.ModalBuilder()
                                        .setCustomId("date-modal")
                                        .setTitle("Enter Date & Time");
                                    dateInput = new discord_js_1.TextInputBuilder()
                                        .setCustomId("date-input")
                                        .setLabel("Enter date (YY/MM/DD)")
                                        .setPlaceholder("24/11/22")
                                        .setStyle(discord_js_1.TextInputStyle.Short);
                                    timeInput = new discord_js_1.TextInputBuilder()
                                        .setCustomId("time-input")
                                        .setLabel("Enter time (HH:MM)")
                                        .setPlaceholder("15:05")
                                        .setStyle(discord_js_1.TextInputStyle.Short);
                                    row1 = new discord_js_1.ActionRowBuilder().addComponents(dateInput);
                                    row2 = new discord_js_1.ActionRowBuilder().addComponents(timeInput);
                                    modal.addComponents(row1, row2);
                                    return [4 /*yield*/, i.showModal(modal)];
                                case 1:
                                    _a.sent();
                                    filter = function (i) {
                                        return i.customId === "date-modal" && i.user.id === interaction.user.id;
                                    };
                                    interaction
                                        .awaitModalSubmit({ filter: filter, time: 60000 })
                                        .then(function (modalInteraction) { return __awaiter(_this, void 0, void 0, function () {
                                        var dateRegex, timeRegex, enteredDate, enteredTime;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    dateRegex = /^\d{2}\/\d{2}\/\d{2}$/;
                                                    timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
                                                    enteredDate = modalInteraction.fields.getTextInputValue("date-input");
                                                    enteredTime = modalInteraction.fields.getTextInputValue("time-input");
                                                    if (!!dateRegex.test(enteredDate)) return [3 /*break*/, 3];
                                                    return [4 /*yield*/, modalInteraction.reply({
                                                            ephemeral: true,
                                                            content: "> :x: Invalid date format. Please use `YY/MM/DD` (e.g., 24/11/22). Please use */reqtraining* again.",
                                                        })];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, (0, database_1.execute)("DELETE FROM trainings WHERE training_id = ?", [
                                                            trainingID,
                                                        ])];
                                                case 2:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                                case 3:
                                                    if (!!timeRegex.test(enteredTime)) return [3 /*break*/, 6];
                                                    return [4 /*yield*/, modalInteraction.reply({
                                                            ephemeral: true,
                                                            content: "> :x: Invalid time format. Please use `HH:MM` in 24-hour format (e.g., 15:05). Please use */reqtraining* again.",
                                                        })];
                                                case 4:
                                                    _a.sent();
                                                    return [4 /*yield*/, (0, database_1.execute)("DELETE FROM trainings WHERE training_id = ?", [
                                                            trainingID,
                                                        ])];
                                                case 5:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                                case 6: return [4 /*yield*/, (0, database_1.execute)("UPDATE trainings SET date = ?, time = ? WHERE training_id = ?", [enteredDate, enteredTime, trainingID])];
                                                case 7:
                                                    _a.sent();
                                                    return [4 /*yield*/, modalInteraction.deferUpdate()];
                                                case 8:
                                                    _a.sent();
                                                    return [4 /*yield*/, requestTraining(interaction, 4 /* TrainingPaginator.Q3 */, trainingID)];
                                                case 9:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })
                                        .catch(function (error) { return __awaiter(_this, void 0, void 0, function () {
                                        var tooLate;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.log(error);
                                                    tooLate = new discord_js_1.EmbedBuilder()
                                                        .setColor("Red")
                                                        .setAuthor({
                                                        name: "".concat(interaction.client.user.username),
                                                        iconURL: "".concat(interaction.client.user.displayAvatarURL()),
                                                    })
                                                        .setTitle(":x: | Late Reply")
                                                        .setDescription("Dear ".concat(interaction.member, ", you did not answer in **60s**. Hence the input will be closed."))
                                                        .setFooter({ text: "Training Request - Questions" });
                                                    return [4 /*yield*/, interaction.editReply({
                                                            components: [],
                                                            embeds: [tooLate],
                                                        })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    collector_2 === null || collector_2 === void 0 ? void 0 : collector_2.on("end", function (collected, reason) { return __awaiter(_this, void 0, void 0, function () {
                        var tooLate;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log();
                                    if (!(reason === "time" && collected.size == 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, (0, database_1.execute)("DELETE FROM trainings WHERE training_id = ?", [
                                            trainingID,
                                        ])];
                                case 1:
                                    _a.sent();
                                    tooLate = new discord_js_1.EmbedBuilder()
                                        .setColor("Red")
                                        .setAuthor({
                                        name: "".concat(interaction.client.user.username),
                                        iconURL: "".concat(interaction.client.user.displayAvatarURL()),
                                    })
                                        .setTitle(":x: | Late Reply")
                                        .setDescription("Dear ".concat(interaction.member, ", you did not answer in **60s**. Hence the input will be closed."))
                                        .setFooter({ text: "Training Request - Questions" });
                                    return [4 /*yield*/, interaction.editReply({
                                            components: [],
                                            embeds: [tooLate],
                                        })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 9];
                case 7:
                    if (!(4 /* TrainingPaginator.Q3 */ === page)) return [3 /*break*/, 9];
                    question3Embed = new discord_js_1.EmbedBuilder()
                        .setColor("#686c70")
                        .setAuthor({
                        name: "".concat(interaction.client.user.username),
                        iconURL: "".concat(interaction.client.user.displayAvatarURL()),
                    })
                        .setTitle("💬 | Training Request")
                        .setDescription("Dear ".concat(interaction.member, ", please enter your **Department** from the dropdown below.\n\n> - **\u26A0\uFE0F Disclaimer**: You have exactly **60s** to answer."))
                        .setFooter({ text: "Training Request - Questions" });
                    dropdown = new discord_js_1.StringSelectMenuBuilder()
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
                    row = new discord_js_1.ActionRowBuilder().addComponents(dropdown);
                    return [4 /*yield*/, interaction.editReply({
                            embeds: [question3Embed],
                            components: [row],
                        })];
                case 8:
                    message = _e.sent();
                    try {
                        filter = function (i) {
                            return i.customId === "department-select" && i.user.id === interaction.user.id;
                        };
                        collector = (_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.createMessageComponentCollector({
                            filter: filter,
                            componentType: discord_js_1.ComponentType.StringSelect,
                            time: 60000,
                        });
                        collector === null || collector === void 0 ? void 0 : collector.on("collect", function (i) { return __awaiter(_this, void 0, void 0, function () {
                            var selectedValues, Captaindata, fodata, fadata, asdata, gcdata, toChannel_1, sentEmbed, userData, dateParts, formattedDate, trainingDateTime, unixTimestamp, role_to_ping, toChannel, trainingChannel, action, textChannel, message_1;
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                            return __generator(this, function (_o) {
                                switch (_o.label) {
                                    case 0:
                                        selectedValues = i.values[0];
                                        return [4 /*yield*/, (0, database_1.execute)("select * from trainings WHERE requester_id = ? AND trainer_id IS NULL AND department = ?", [(_a = interaction === null || interaction === void 0 ? void 0 : interaction.member) === null || _a === void 0 ? void 0 : _a.user.id, "Captain"])];
                                    case 1:
                                        Captaindata = _o.sent();
                                        return [4 /*yield*/, (0, database_1.execute)("select * from trainings WHERE requester_id = ? AND trainer_id IS NULL AND department = ?", [(_b = interaction === null || interaction === void 0 ? void 0 : interaction.member) === null || _b === void 0 ? void 0 : _b.user.id, "First Officer"])];
                                    case 2:
                                        fodata = _o.sent();
                                        return [4 /*yield*/, (0, database_1.execute)("select * from trainings WHERE requester_id = ? AND trainer_id IS NULL AND department = ?", [(_c = interaction === null || interaction === void 0 ? void 0 : interaction.member) === null || _c === void 0 ? void 0 : _c.user.id, "Flight Attendant"])];
                                    case 3:
                                        fadata = _o.sent();
                                        return [4 /*yield*/, (0, database_1.execute)("select * from trainings WHERE requester_id = ? AND trainer_id IS NULL AND department = ?", [(_d = interaction === null || interaction === void 0 ? void 0 : interaction.member) === null || _d === void 0 ? void 0 : _d.user.id, "Airport Staff"])];
                                    case 4:
                                        asdata = _o.sent();
                                        return [4 /*yield*/, (0, database_1.execute)("select * from trainings WHERE requester_id = ? AND trainer_id IS NULL AND department = ?", [(_e = interaction === null || interaction === void 0 ? void 0 : interaction.member) === null || _e === void 0 ? void 0 : _e.user.id, "Ground Crew"])];
                                    case 5:
                                        gcdata = _o.sent();
                                        return [4 /*yield*/, i.deferUpdate()];
                                    case 6:
                                        _o.sent();
                                        if (Captaindata.length > 0 ||
                                            fodata.length > 0 ||
                                            fadata.length > 0 ||
                                            asdata.length > 0 ||
                                            gcdata.length > 0) {
                                            toChannel_1 = new discord_js_1.EmbedBuilder()
                                                .setColor("Red")
                                                .setAuthor({
                                                name: "".concat(interaction.client.user.username),
                                                iconURL: "".concat(interaction.client.user.displayAvatarURL()),
                                            })
                                                .setTitle(":x: | Already Sent a Request")
                                                .setDescription("> Dear ".concat(interaction.member, ", you have sadly already sent a request for the selected department, that has not been answered yet. Please wait until your request is answered before publishing another one for this department, or select a different department.\n> The input has been closed. Please use */reqtraining* again."))
                                                .setFooter({ text: "Training Request - Error" });
                                            return [2 /*return*/, interaction.editReply({
                                                    embeds: [toChannel_1],
                                                })];
                                        }
                                        if (!(selectedValues === "captain")) return [3 /*break*/, 8];
                                        return [4 /*yield*/, (0, database_1.execute)("UPDATE trainings SET department = ? WHERE training_id = ?", ["Captain", trainingID])];
                                    case 7:
                                        _o.sent();
                                        return [3 /*break*/, 16];
                                    case 8:
                                        if (!(selectedValues === "first_officer")) return [3 /*break*/, 10];
                                        return [4 /*yield*/, (0, database_1.execute)("UPDATE trainings SET department = ? WHERE training_id = ?", ["First Officer", trainingID])];
                                    case 9:
                                        _o.sent();
                                        return [3 /*break*/, 16];
                                    case 10:
                                        if (!(selectedValues === "flight_attendant")) return [3 /*break*/, 12];
                                        return [4 /*yield*/, (0, database_1.execute)("UPDATE trainings SET department = ? WHERE training_id = ?", ["Flight Attendant", trainingID])];
                                    case 11:
                                        _o.sent();
                                        return [3 /*break*/, 16];
                                    case 12:
                                        if (!(selectedValues === "airport_staff")) return [3 /*break*/, 14];
                                        return [4 /*yield*/, (0, database_1.execute)("UPDATE trainings SET department = ? WHERE training_id = ?", ["Airport Staff", trainingID])];
                                    case 13:
                                        _o.sent();
                                        return [3 /*break*/, 16];
                                    case 14: return [4 /*yield*/, (0, database_1.execute)("UPDATE trainings SET department = ? WHERE training_id = ?", ["Ground Crew", trainingID])];
                                    case 15:
                                        _o.sent();
                                        _o.label = 16;
                                    case 16:
                                        sentEmbed = new discord_js_1.EmbedBuilder()
                                            .setColor("Green")
                                            .setAuthor({
                                            name: "".concat(interaction.client.user.username),
                                            iconURL: "".concat(interaction.client.user.displayAvatarURL()),
                                        })
                                            .setTitle("✅ | Request Sent!")
                                            .setDescription("> Dear ".concat(interaction.member, ", you have successfully filled in the training request details. The message has been sent in the training channel, and you will be notified when a trainer accepts your request."))
                                            .setFooter({
                                            text: "Remember, if your training isn't accepted by the time that your training is supposed to start, the training will be automatically closed.",
                                        });
                                        return [4 /*yield*/, (0, database_1.execute)("SELECT * FROM trainings WHERE training_id = ?", [trainingID])];
                                    case 17:
                                        userData = _o.sent();
                                        dateParts = userData[0].date.split("/");
                                        formattedDate = "20".concat(dateParts[2], "-").concat(dateParts[1], "-").concat(dateParts[0]);
                                        trainingDateTime = new Date("".concat(formattedDate, "T").concat(userData[0].time, ":00"));
                                        unixTimestamp = Math.floor(trainingDateTime.getTime() / 1000);
                                        if (userData[0].department == "Ground Crew") {
                                            role_to_ping = (_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.roles.cache.find(function (role) { return role.id === config.ground_crew_role; });
                                        }
                                        if (userData[0].department == "Airport Staff") {
                                            role_to_ping = (_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.roles.cache.find(function (role) { return role.id === config.airport_staff; });
                                        }
                                        if (userData[0].department == "Flight Attendant") {
                                            role_to_ping = (_h = interaction.guild) === null || _h === void 0 ? void 0 : _h.roles.cache.find(function (role) { return role.id === config.flight_attendant; });
                                        }
                                        if (userData[0].department == "First Officer") {
                                            role_to_ping = (_j = interaction.guild) === null || _j === void 0 ? void 0 : _j.roles.cache.find(function (role) { return role.id === config.first_officer; });
                                        }
                                        if (userData[0].department == "Captain") {
                                            role_to_ping = (_k = interaction.guild) === null || _k === void 0 ? void 0 : _k.roles.cache.find(function (role) { return role.id === config.captain; });
                                        }
                                        toChannel = new discord_js_1.EmbedBuilder()
                                            .setColor("#686c70")
                                            .setAuthor({
                                            name: "".concat(interaction.client.user.username),
                                            iconURL: "".concat(interaction.client.user.displayAvatarURL()),
                                        })
                                            .setTitle("💬 | Incoming Training Request")
                                            .setDescription("> A member has requested a training. Please view the details down below:\n" +
                                            "> **Status:** \uD83D\uDD34 (Unclaimed)\n" +
                                            "### \uD83D\uDC64 User Details\n" +
                                            "> ".concat(interaction.member, " - (").concat((_l = interaction.member) === null || _l === void 0 ? void 0 : _l.user.id, ")\n") +
                                            "### \uD83D\uDCAC Request Details\n" +
                                            "> **Stage:** ".concat(userData[0].stage, "\n") +
                                            "> **Date and Time:** <t:".concat(unixTimestamp, ":F>\n") + // Full date and time format
                                            "> **Department:** ".concat(userData[0].department, "\n\n") +
                                            "> Interested? Click on the **Claim** button below.\n" +
                                            "> Want to send the requester a message? Simply click on the **Send DM** button below.")
                                            .setFooter({
                                            text: "Training Request - Questions",
                                        });
                                        trainingChannel = (_m = interaction.guild) === null || _m === void 0 ? void 0 : _m.channels.cache.get(config.training_channel);
                                        if (!(trainingChannel && trainingChannel.isTextBased())) return [3 /*break*/, 21];
                                        action = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                            .setCustomId("claim")
                                            .setEmoji("✅")
                                            .setLabel("Claim")
                                            .setStyle(discord_js_1.ButtonStyle.Success)
                                            .setDisabled(false), new discord_js_1.ButtonBuilder()
                                            .setCustomId("send_dm")
                                            .setEmoji("💬")
                                            .setLabel("Send DM")
                                            .setStyle(discord_js_1.ButtonStyle.Secondary)
                                            .setDisabled(false));
                                        textChannel = trainingChannel;
                                        return [4 /*yield*/, textChannel.send({
                                                embeds: [toChannel],
                                                components: [action],
                                                content: "".concat(role_to_ping),
                                            })];
                                    case 18:
                                        message_1 = _o.sent();
                                        return [4 /*yield*/, (0, database_1.execute)("UPDATE trainings SET message_id = ? WHERE training_id = ?", [message_1.id, trainingID])];
                                    case 19:
                                        _o.sent();
                                        return [4 /*yield*/, interaction.editReply({ embeds: [sentEmbed], components: [] })];
                                    case 20:
                                        _o.sent();
                                        _o.label = 21;
                                    case 21: return [2 /*return*/];
                                }
                            });
                        }); });
                        collector === null || collector === void 0 ? void 0 : collector.on("end", function (collected, reason) { return __awaiter(_this, void 0, void 0, function () {
                            var tooLate;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("department");
                                        if (!(reason === "time" && collected.size == 0)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, (0, database_1.execute)("DELETE FROM trainings WHERE training_id = ?", [
                                                trainingID,
                                            ])];
                                    case 1:
                                        _a.sent();
                                        tooLate = new discord_js_1.EmbedBuilder()
                                            .setColor("Red")
                                            .setAuthor({
                                            name: "".concat(interaction.client.user.username),
                                            iconURL: "".concat(interaction.client.user.displayAvatarURL()),
                                        })
                                            .setTitle(":x: | Late Reply")
                                            .setDescription("Dear ".concat(interaction.member, ", you did not answer in **60s**. Hence the input will be closed."))
                                            .setFooter({ text: "Training Request - Questions" });
                                        return [4 /*yield*/, interaction.editReply({
                                                components: [],
                                                embeds: [tooLate],
                                            })];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    catch (e) {
                        console.log(e);
                    }
                    _e.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
