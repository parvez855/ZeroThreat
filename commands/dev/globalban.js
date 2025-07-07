const { MessageEmbed } = require('discord.js');

const ricky = ['1212431696381612132', '1247081397928067084'];

module.exports = {
    name: 'globalban',
    aliases: ['gban'],
    category: 'Owner',
    run: async (client, message, args) => {
        if (!ricky.includes(message.author.id)) return;

        let userId = args[0];
        if (!userId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293>  | Please Provide Valid user ID or Mention Member.`)
                ]
            });
        }

        if (userId) {
            try {
                for (const [_, guild] of client.guilds.cache) {
                    if (guild.members.cache.has(userId)) {
                        setTimeout(async () => {
                            try {
                                await guild.members.ban(userId, {
                                    reason: "User has been globally banned due to repeated and severe violations of Discord's terms of service, including but not limited to harassment, nuking, spamming, distributing malicious content, and engaging in activities that undermine the safety and well-being of the Discord community. This global ban is a result of a pattern of behavior that is deemed unacceptable, and it is necessary to ensure the integrity and security of multiple servers on the platform."
                                });
                                message.channel.send(`Banned From ${guild.name}`);
                            } catch (error) {
                                message.channel.send(`Can't Ban User`);
                            }
                        }, 3000); // 3000 milliseconds delay (3 seconds)
                    }
                }
            } catch (error) {
                message.channel.send(`Can't Ban User`);
            }
        }
    }
};
