const { MessageEmbed } = require('discord.js')
const ricky = [
    '1300534329402982472'
]

module.exports = {
    name: 'extraowner',
    aliases: ['eowner'],
    category: 'security',
    premium: false,
    run: async (client, message, args) => {
        if (message.guild.memberCount < 5) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | **Your Server Doesn't Meet My 5 Member Criteria**`
                        )
                ]
            })
        }
        if (
            message.author.id != message.guild.ownerId &&
            !ricky.includes(message.author.id)
        )
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | **Only Server Owner Can Run This Command.!**`
                        )
                ]
            })
        let prefix = '$' || message.guild.prefix
        const option = args[0] // Change this line

        const antinuke = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**Extra Owner**__`)
            .setDescription(
                `**ExtraOwner Can Edit Server Antinuke Status Whitelisted Members So Be Careful Before Adding Someone in it**`
            )
            .addFields([
                {
                    name: `__**Extraowner Set**__`,
                    value: `**To Set Extra Owner, Use - \`${prefix}extraowner set @user**\``
                },
                {
                    name: `__**Extraowner Reset**__`,
                    value: `**To Reset Extra Owner, Use - \`${prefix}extraowner reset**\``
                },
                {
                    name: `__**Extraowner View**__`,
                    value: `**To View Extra Owner, Use - \`${prefix}extraowner view**\``
                }
            ])
        if (!option) {
            message.channel.send({ embeds: [antinuke] })
        } else if (option.toLowerCase() === 'set') {
            const user =
                getUserFromMention(message, args[1]) ||
                client.users.cache.get(args[1])

            if (!user)
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | **Please Provide a Valid User Mention or ID to Set as Extra Owner!**`
                            )
                    ]
                })
            if (user.bot) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | **You Cannot Add Any Bots to Extraowner** `
                            )
                    ]
                })
            }
            if (user) {
                await client.db.set(`extraowner_${message.guild.id}`, {
                    owner: user.id
                })
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:Tick:1306038825054896209> | **Successfully Added ${user} As Extraowner**`
                            )
                    ]
                })
            }
        } else if (option.toLowerCase() === 'reset') {
            const data = await client.db.get(`extraowner_${message.guild.id}`)
            if (!data) {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:Tick:1306038825054896209> | **There Is No Extraowner Configuration In This Server.!**`
                            )
                    ]
                })
            } else if (data) {
                await client.db.set(`extraowner_${message.guild.id}`, null)
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:Tick:1306038825054896209> | **Successfully Disabled Extraowner Configuration.!**`
                            )
                    ]
                })
            }
        } else if (option.toLowerCase() === 'view') {
            const data = await client.db.get(`extraowner_${message.guild.id}`)
            if (!data?.owner)
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | **No Extraowner is Set.!**`
                            )
                    ]
                })
            const whitelisted = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`**Current Extraowner is <@${data.owner}>**`)
            message.channel.send({ embeds: [whitelisted] })
        }
    }
}

function getUserFromMention(message, mention) {
    if (!mention) return null

    const matches = mention.match(/^<@!?(\d+)>$/)
    if (!matches) return null

    const id = matches[1]
    return message.client.users.cache.get(id)
}
