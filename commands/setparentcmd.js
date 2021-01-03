const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        let prefix = '!gb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const parentID = args[0]
            const guildparents = message.guild.channels.cache
            const categoriestout = guildparents.filter((categorie) => categorie.type === 'category')
            const categoriesId = categoriestout.map(id => id.id)
            if (categoriesId.includes(parentID)) {
                db.set('catcmd_' + message.guild.id, parentID)
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('✅ **Catégorie pour les tickets de commande à l\'identifiant `' + parentID + '` enregistrée**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Veuillez entrer l\'identifiant d\'une catégorie**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 **Vous n\'avez pas les permissions suffisantes**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
