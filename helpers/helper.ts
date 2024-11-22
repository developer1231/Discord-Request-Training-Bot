import { execute } from "../database/database";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import * as fs from "fs";
const MAX_DROP = 1000;
const RANDOM_STARS: string = `A beautiful shooting star leaves behind a faint blue trail as it streaks across the night sky. It moves swiftly and gracefully across the stars, leaving a brief trail of glowing blue dust in its wake. The light dims quickly, but for a moment there was a brilliant flash that illuminated the sky just as if the sun had suddenly risen in the middle of the night.

> As the shooting star disappeared from sight, so too did the dazzling blue light that illuminated the sky. A soft woosh sound could be heard, followed by a faint patter. Then, as if by miracle of the night, tiny specks of glowing blue dust sprinkled the ground. The star fragments were too small and delicate to be held carelessly, but were nonetheless beautiful to behold in their own right. The soft glow that emanated from them seemed to dance in the wind and disappear as quickly as it came.`;

export async function dropCrystals(
  dropChannel: TextChannel,
  url: string
): Promise<void> {
  const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  let randomDropNumber: number = Math.round(Math.random() * MAX_DROP);

  const actionRow: ActionRowBuilder<ButtonBuilder> =
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId("catch_star")
        .setEmoji("🪄")
        .setLabel("Catch")
    );

  let dropEmbed: EmbedBuilder = new EmbedBuilder()
    .setTitle("✨ | New Star Drop!")
    .setImage(`${config.image}`)
    .setThumbnail(url)
    .setDescription(
      `> ${RANDOM_STARS}\n> **Star Earnings**: ${randomDropNumber}✨.\n\n> - Click the button below to catch this star!\n> - Be fast.. you only have **1 hour** to catch the star before it disappears!`
    )
    .setTimestamp()
    .setColor("#6488EA");

  let message = await dropChannel.send({
    embeds: [dropEmbed],
    components: [actionRow],
  });
  await execute(
    `INSERT INTO stars (star_drop_amount, message_id) VALUES (?, ?)`,
    [randomDropNumber, message.id]
  );

  setTimeout(async () => {
    try {
      const actionRow: ActionRowBuilder<ButtonBuilder> =
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId("catch_star")
            .setDisabled(true)
            .setEmoji("🪄")
            .setLabel("Catch")
        );

      let Embed = EmbedBuilder.from(message.embeds[0]);
      Embed.setDescription(
        `> This star once shone within reach, but now it drifts beyond grasp, lost to the depths of a distant sky.\n\n> **This star cannot be caught anymore!**`
      ).setTitle("❌ | Star Out Of Reach!");
      await message.edit({
        embeds: [Embed],
        components: [actionRow],
        files: [],
      });
      await execute(`DELETE FROM stars WHERE message_id = ?`, [message.id]);
    } catch (e) {
      console.log(e);
    }
  }, 60 * 60 * 1000);
}
