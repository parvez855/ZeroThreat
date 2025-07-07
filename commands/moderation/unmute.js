const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'unmute',
    aliases: ['um'],
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {
        if (!message.member.permissions.has('MODERATE_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Timeout Members\` permissions to use this command.`
                        )
                ]
            })
        }
        if (!message.guild.me.permissions.has('MODERATE_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I must have \`Timeout Members\` permissions to run this command.`
                        )
                ]
            })
        }
        let member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0])
        if (!member) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't mentioned the member whom you want to mute.`
                        )
                ]
            })
        }
        let reason = args.slice(1).join(' ').trim()
        if (!reason) reason = 'No Reason'
        reason = `${message.author.tag} (${message.author.id}) | ` + reason
        const response = await untimeout(message.member, member, reason)
        await message.channel.send(response)
    }
}
async function untimeout(issuer, target, reason) {
    let client = target.client
    const response = await unTimeoutTarget(issuer, target, reason)
    if (typeof response === 'boolean')
        return getEmbed(
            `<a:Tick:1306038825054896209> | Successfully unmuted <@${target.user.id}>!`,
            client
        )
    if (response === 'BOT_PERM')
        return getEmbed(
            `<:emoji_1725906884992:1306038885293494293>  | I don't have enough permissions to unmute <@${target.user.id}>.`,
            client
        )
    else if (response === 'MEMBER_PERM')
        return getEmbed(
            `<:emoji_1725906884992:1306038885293494293>  | You don't have enough permissions to unmute <@${target.user.id}>.`,
            client
        )
    else if (response === 'NO_TIMEOUT')
        return getEmbed(
            `<:emoji_1725906884992:1306038885293494293>  | <@${target.user.id}> is not muted only!`,
            client
        )
    else
        return getEmbed(
            `<:emoji_1725906884992:1306038885293494293>  | I don't have enough perms to unmute <@${target.user.id}>.`,
            client
        )
}

async function unTimeoutTarget(issuer, target, reason) {
    if (!memberInteract(issuer, target)) return 'MEMBER_PERM'
    if (!memberInteract(issuer.guild.me, target)) return 'BOT_PERM'
    if (target.communicationDisabledUntilTimestamp - Date.now() < 0)
        return 'NO_TIMEOUT'

    try {
        await target.timeout(0, reason)
        return true
    } catch (ex) {
        return 'ERROR'
    }
}

function memberInteract(issuer, target) {
    const { guild } = issuer
    if (guild.ownerId === issuer.id) return true
    if (guild.ownerId === target.id) return false
    return issuer.roles.highest.position > target.roles.highest.position
}

function getEmbed(title, client) {
    let embed = new MessageEmbed().setColor(client.color).setDescription(title)
    return { embeds: [embed] }
}
