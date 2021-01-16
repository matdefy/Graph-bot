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
        const descriptcmd = message.content.trim().slice(`${config.prefix}cmd `.length)
        const guild = message.guild.name
        if (db.has('channelcmd_' + message.guild.id)) {
            // vérification que le salon stockée dans la base de données est valide
            const channelID = db.get('channelcmd_' + message.guild.id)
            const guildchannels = message.guild.channels.cache.map(channel => channel.id)
            if (guildchannels.includes(channelID)) {
                if (descriptcmd.length > 14) {
                    const channelCMD = db.get('channelcmd_' + message.guild.id)
                    client.channels.cache.get(channelCMD).send({
                        embed: new Discord.MessageEmbed()
                            .setDescription('🎉 **Nouvelle commande**\n\nDescription : <' + descriptcmd + '>\nUtilisateur : ' + message.author.tag + ' (' + message.author.id + ')')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL())
                    }).then(msg => {
                        msg.react('✅')
                    })
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ **Commande enregistré ' + message.author.tag + '**\n\nAller dans les messages privés de Graph Bot pour avoir tous les détails sur votre  📩 commande 📩 !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                        .setColor('00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                    message.author.createDM().then(channel => {
                        channel.send(new Discord.MessageEmbed()
                            .setDescription(`✅ **Commande enregistré**\n\nVotre commande avec la description \`${descriptcmd}\` sur le serveur ${guild} a bien été prise en compte, vous serez notifiée 🔽 ici 🔽 lorsqu'un graphiste vous aura pris en charge !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**`)
                            .setColor('00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    })
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **La description de votre commande doit faire plus de 15 caractères**\n\n(votre description doit comprendre le prix minimum que vous pouvez allouer à votre demande, ainsi qu’une brève description de celle-ci)\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Le système de commande est invalide**\n\n`' + prefix + 'installhelp` : permet de vous guider dans la configuration de Graph Bot, en vous expliquant pas à pas les différentes fonctionnalités à configurer !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ **Le système de commande n\'est pas initialisé sur ce serveur**\n\n`' + prefix + 'installhelp` : permet de vous guider dans la configuration de Graph Bot, en vous expliquant pas à pas les différentes fonctionnalités à configurer !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
