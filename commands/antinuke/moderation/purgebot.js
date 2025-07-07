const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'purgebots',
    aliases: ['pb'],
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Messages\` permissions to use this command.`
                        )
                ]
            })
        }
        if (
            !message.guild.me.permissions.has([
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY'
            ])
        ) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I must have \`Manage Messages\`, \`Read Message History\` permissions to use this command.`
                        )
                ]
            })
        }
        const embed = new MessageEmbed().setColor(client.color)
        const amount = args[0] || 99
        if (amount > 99) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Maximum **99** bot messages can be purged at a time.`
                        )
                ]
            })
        }
        const response = await client.util.purgeMessages(
            message.member,
            message.channel,
            'BOT',
            amount
        )
        if (typeof response === 'number') {
            return message.channel
                .send({
                    embeds: [
                        embed.setDescription(
                            `<a:Tick:1306038825054896209> | Successfully deleted ${response} bot messages.`
                        )
                    ]
                })
                .then((m) => {
                    setTimeout(() => {
                        m.delete().catch((err) => null)
                    }, 2000)
                })
        } else if (response === 'BOT_PERM') {
            return message.channel.send({
                embeds: [
                    embed.setDescription(
                        `<:emoji_1725906884992:1306038885293494293>  | I must have \`Manage Messages\`, \`Read Message History\` permissions to use this command.`
                    )
                ]
            })
        } else if (response === 'MEMBER_PERM') {
            return message.channel.send({
                embeds: [
                    embed.setDescription(
                        `<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Messages\` permissions to use this command.`
                    )
                ]
            })
        } else if (response === 'NO_MESSAGES') {
            return message.channel.send({
                embeds: [
                    embed.setDescription(
                        `<:emoji_1725906884992:1306038885293494293>  | There were no bots messages to purge.`
                    )
                ]
            })
        } else {
            return message.channel.send({
                embeds: [
                    embed.setDescription(
                        `<:emoji_1725906884992:1306038885293494293>  | I was unable to delete the messages`
                    )
                ]
            })
        }
    }
}
