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
exports.dropCrystals = dropCrystals;
var database_1 = require("../database/database");
var discord_js_1 = require("discord.js");
var fs = require("fs");
var MAX_DROP = 1000;
var RANDOM_STARS = "A beautiful shooting star leaves behind a faint blue trail as it streaks across the night sky. It moves swiftly and gracefully across the stars, leaving a brief trail of glowing blue dust in its wake. The light dims quickly, but for a moment there was a brilliant flash that illuminated the sky just as if the sun had suddenly risen in the middle of the night.\n\n> As the shooting star disappeared from sight, so too did the dazzling blue light that illuminated the sky. A soft woosh sound could be heard, followed by a faint patter. Then, as if by miracle of the night, tiny specks of glowing blue dust sprinkled the ground. The star fragments were too small and delicate to be held carelessly, but were nonetheless beautiful to behold in their own right. The soft glow that emanated from them seemed to dance in the wind and disappear as quickly as it came.";
function dropCrystals(dropChannel, url) {
    return __awaiter(this, void 0, void 0, function () {
        var config, randomDropNumber, actionRow, dropEmbed, message;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
                    randomDropNumber = Math.round(Math.random() * MAX_DROP);
                    actionRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                        .setStyle(discord_js_1.ButtonStyle.Primary)
                        .setCustomId("catch_star")
                        .setEmoji("🪄")
                        .setLabel("Catch"));
                    dropEmbed = new discord_js_1.EmbedBuilder()
                        .setTitle("✨ | New Star Drop!")
                        .setImage("".concat(config.image))
                        .setThumbnail(url)
                        .setDescription("> ".concat(RANDOM_STARS, "\n> **Star Earnings**: ").concat(randomDropNumber, "\u2728.\n\n> - Click the button below to catch this star!\n> - Be fast.. you only have **1 hour** to catch the star before it disappears!"))
                        .setTimestamp()
                        .setColor("#6488EA");
                    return [4 /*yield*/, dropChannel.send({
                            embeds: [dropEmbed],
                            components: [actionRow],
                        })];
                case 1:
                    message = _a.sent();
                    return [4 /*yield*/, (0, database_1.execute)("INSERT INTO stars (star_drop_amount, message_id) VALUES (?, ?)", [randomDropNumber, message.id])];
                case 2:
                    _a.sent();
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        var actionRow_1, Embed, e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    actionRow_1 = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                        .setStyle(discord_js_1.ButtonStyle.Primary)
                                        .setCustomId("catch_star")
                                        .setDisabled(true)
                                        .setEmoji("🪄")
                                        .setLabel("Catch"));
                                    Embed = discord_js_1.EmbedBuilder.from(message.embeds[0]);
                                    Embed.setDescription("> This star once shone within reach, but now it drifts beyond grasp, lost to the depths of a distant sky.\n\n> **This star cannot be caught anymore!**").setTitle("❌ | Star Out Of Reach!");
                                    return [4 /*yield*/, message.edit({
                                            embeds: [Embed],
                                            components: [actionRow_1],
                                            files: [],
                                        })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, (0, database_1.execute)("DELETE FROM stars WHERE message_id = ?", [message.id])];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _a.sent();
                                    console.log(e_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }, 60 * 60 * 1000);
                    return [2 /*return*/];
            }
        });
    });
}
