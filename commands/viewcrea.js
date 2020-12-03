const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        const user = message.mentions.users.first()
        if (message.mentions.users.size === 1) {
            if (db.has('crea_' + user.id)) {
                const creations = db.get('crea_' + user.id)
                const text = creations.map((crea) => 'Création numéro `' + crea.id + '`\n' + 'Vérification ' + crea.verif + '\n' + 'Avancer ' + crea.advance + '\n')
                message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setDescription(text)
                        .setColor('#FF0000')
                        .setFooter(config.version, message.client.user.avatarURL()),
                    files: creations.map((crea) => {
                        return {
                            name: crea.id + '.' + crea.url.split('.').pop(),
                            attachment: crea.url
                        }
                    })
                })
                if (db.has('descript_' + user.id)) {
                    message.channel.send(new Discord.MessageEmbed()
                        .setTitle('Description :')
                        .setDescription(db.get('descript_' + user.id) + '\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#FF0000')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
                if (db.has('level_' + user.id)) {
                    const level = db.get('level_' + user.id)
                    message.channel.send(new Discord.MessageEmbed()
                        .setTitle('Level :')
                        .setDescription('`' + level + '`')
                        .setColor('#FF0000')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Ce membre n\'est pas enregistré dans la base de données ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        }
        if (message.mentions.users.size === 0) {
            if (args[0]) {
                const memberID = args[0]
                if (memberID.length !== 0) {
                    if (db.has('crea_' + memberID)) {
                        const creations2 = db.get('crea_' + memberID)
                        const text2 = creations2.map((crea) => 'Création numéro `' + crea.id + '`\n' + 'Vérification ' + crea.verif + '\n' + 'Avancer ' + crea.advance + '\n')
                        message.channel.send({
                            embed: new Discord.MessageEmbed()
                                .setDescription(text2)
                                .setColor('#FF0000')
                                .setFooter(config.version, message.client.user.avatarURL()),
                            files: creations2.map((crea) => {
                                return {
                                    name: crea.id + '.' + crea.url.split('.').pop(),
                                    attachment: crea.url
                                }
                            })
                        })
                        if (db.has('descript_' + memberID)) {
                            message.channel.send(new Discord.MessageEmbed()
                                .setTitle('Description :')
                                .setDescription(db.get('descript_' + memberID) + '\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                                .setColor('#FF0000')
                                .setFooter(config.version, message.client.user.avatarURL()))
                        }
                        if (db.has('level_' + memberID)) {
                            const level = db.get('level_' + memberID)
                            message.channel.send(new Discord.MessageEmbed()
                                .setTitle('Level :')
                                .setDescription('`' + level + '`')
                                .setColor('#FF0000')
                                .setFooter(config.version, message.client.user.avatarURL()))
                        }
                    } else {
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('⚠️ Ce membre n\'est pas enregistré dans la base de données ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                            .setColor('#e55f2a')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    }
                }
            } else {
                if (db.has('crea_' + message.author.id)) {
                    const creations2 = db.get('crea_' + message.author.id)
                    const text2 = creations2.map((crea) => 'Création numéro `' + crea.id + '`\n' + 'Vérification ' + crea.verif + '\n' + 'Avancer ' + crea.advance + '\n')
                    message.channel.send({
                        embed: new Discord.MessageEmbed()
                            .setDescription(text2)
                            .setColor('#FF0000')
                            .setFooter(config.version, message.client.user.avatarURL()),
                        files: creations2.map((crea) => {
                            return {
                                name: crea.id + '.' + crea.url.split('.').pop(),
                                attachment: crea.url
                            }
                        })
                    })
                    if (db.has('descript_' + message.author.id)) {
                        message.channel.send(new Discord.MessageEmbed()
                            .setTitle('Description :')
                            .setDescription(db.get('descript_' + message.author.id) + '\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                            .setColor('#FF0000')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    }
                    if (db.has('level_' + message.author.id)) {
                        const level = db.get('level_' + message.author.id)
                        message.channel.send(new Discord.MessageEmbed()
                            .setTitle('Level :')
                            .setDescription('`' + level + '`')
                            .setColor('#FF0000')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    }
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ Vous n\'êtes pas enregistré dans la base de données ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            }
        }
    }
}
