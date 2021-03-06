const Discord = require('discord.js')
const config = require('../config.json')
const hastebin = require('hastebin-gen')

module.exports = {
    run: async (db, message, args, client) => {
        let prefix = config.prefix
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        const guildOUuser = args[0]
        let prixcmd = null
        let mdepcmd = null
        let delaicmd = null
        let descriptcmd = null
        let prestataireconcerne = null
        let guildconcerne = null
        const user = client.users.cache.find((element) => element.id === guildOUuser)
        const guild = client.guilds.cache.find((element) => element.id === guildOUuser)
        if (guildOUuser !== undefined) {
            if (!user && !guild) {
                return message.channel.send(`<:warning_visualorder:831550961625464832> **Utilisateur ou serveur avec l\'identifiant : \`${guildOUuser}\` inconnu !**`)
            }
            if (user) {
                prestataireconcerne = args[0]
            }
            if (guild) {
                guildconcerne = args[0]
                const guildchannels = client.guilds.cache.get(guildconcerne).channels.cache
                const channelstout = guildchannels.filter((salon) => salon.type === 'text')
                const channelsId = channelstout.map(channels => channels.id)
                const channelCMD = db.get('channelcmd_' + guildconcerne)
                if (!channelCMD) {
                    return message.channel.send('<:warning_visualorder:831550961625464832> **Le système de commande n\'est pas initialisé sur le serveur sélectionné !**')
                }
                if (!channelsId.includes(channelCMD)) {
                    return message.channel.send('<:warning_visualorder:831550961625464832> **Le système de commande est invalide sur le serveur sélectionné !**')
                }
            }
        }
        message.channel.send(new Discord.MessageEmbed()
            .setDescription(`📮 **Commande activée <@${message.author.id}> !**\n\nVeuillez répondre aux questions envoyées en message privé pour finaliser l\'enregistrement de votre commande.`)
            .setColor('FF7B00')
            .setFooter(config.version, message.client.user.avatarURL()))

        const channelMP = await message.author.createDM()
        channelMP.send('**Quel prix souhaitez-vous ? (en euro/s)**')
        const collector = channelMP.createMessageCollector(
            m => m.author.id === message.author.id,
            {
                time: 120000 // 2 minutes
            }
        )
        collector.on('collect', async msg => {
            if (!prixcmd) {
                if (isNaN(msg.content)) {
                    return channelMP.send('<:warning_visualorder:831550961625464832> **Le prix de votre commande doit être seulement exprimé par un nombre positif !**')
                }
                prixcmd = msg.content
                channelMP.send(`<:white_check_mark_visualOrder:831103841680097280> **Le prix de votre commande sera de **\`${prixcmd}€\`** !**`)

                channelMP.send('**Quel mode de paiement souhaitez-vous ?**')
                return
            }
            if (!mdepcmd) {
                mdepcmd = msg.content
                channelMP.send(`<:white_check_mark_visualOrder:831103841680097280> **Le mode de paiement pour votre commande sera par **\`${mdepcmd}\`** !**`)

                channelMP.send('**Quel délai maximum souhaitez-vous ? (en jour/s)**')
                return
            }
            if (!delaicmd) {
                if (isNaN(msg.content)) {
                    return channelMP.send('<:warning_visualorder:831550961625464832> **Le délai maximum pour votre commande doit être seulement exprimé par un nombre positif !**')
                }
                delaicmd = msg.content
                channelMP.send(`<:white_check_mark_visualOrder:831103841680097280> **Le délai maximum pour votre commande sera de **\`${delaicmd}\`** jour/s !**`)
                // questionnaire delai

                // questionnaire description
                channelMP.send('**Quelle est la description de votre commande ? (minimum 15 caractères, maximum 500 caractères)**')
                return
            }
            if (!descriptcmd) {
                // questionnaire description
                if (msg.content.length > 14 && msg.content.length < 500) {
                    descriptcmd = msg.content
                    channelMP.send(`<:white_check_mark_visualOrder:831103841680097280> **La description de votre commande sera : **\`${descriptcmd}\`** !**`)
                    collector.stop()
                    const cmd = db.get('cmd')
                    let id = 1
                    if (db.has('cmd')) {
                        id = cmd.length + 1
                    }
                    db.push('cmd', {
                        id: id,
                        descript: descriptcmd,
                        prix: prixcmd,
                        mdep: mdepcmd,
                        delai: delaicmd,
                        guildconcerne: guildconcerne,
                        prestataireconcerne: prestataireconcerne,
                        client: message.author.id,
                        prestataire: null,
                        statut: 'attente',
                        transcript: null,
                        message: null,
                        channelmessage: null
                    })
                    let infoprestataireconcerne = 'aucun'
                    if (prestataireconcerne) {
                        infoprestataireconcerne = `<@${prestataireconcerne}>`
                    }
                    let infoguildconcerne = 'aucun'
                    if (guildconcerne) {
                        infoguildconcerne = `\`${guildconcerne}\``
                    }
                    message.author.createDM().then(channel => {
                        channel.send(new Discord.MessageEmbed()
                            .setDescription(`📮 **Commande (\`${id}\`) enregistrée !**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${message.author.id}>\n\n**-Serveur concerné : **${infoguildconcerne}\n\n**-Prestataire concerné : **${infoprestataireconcerne}\n\n**Pour annuler cette commande, cliquez sur la réaction 🗑️.**`)
                            .setColor('#FF7B00')
                            .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                            msg.react('🗑️')
                        })
                    })
                    if (user) {
                        client.users.cache.get(prestataireconcerne).send(new Discord.MessageEmbed()
                            .setDescription(`📮 **Commande (\`${id}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${message.author.id}>\n\n**-Serveur concerné : **${infoguildconcerne}\n\n**-Prestataire concerné : **${infoprestataireconcerne}\n\n**Pour refuser la commande, cliquez sur la réaction : 📪.**`)
                            .setColor('#FF7B00')
                            .setFooter(config.version, client.user.avatarURL())).then((msg) => {
                            msg.react('📩')
                            msg.react('📪')
                            cmd.find((cmd) => cmd.id === parseInt(id)).message = msg.id
                            // Écrire les modifications dans la base de données
                            db.set('cmd', cmd)
                            cmd.find((cmd) => cmd.id === parseInt(id)).channelmessage = msg.channel.id
                            // Écrire les modifications dans la base de données
                            db.set('cmd', cmd)
                        })
                        message.client.channels.cache.get('829720129351712790').send(`📮 **Commande (\`${id}\`) enregistrée**`)
                    }
                    if (guild) {
                        const channelCMD = db.get('channelcmd_' + guildconcerne)
                        message.client.channels.cache.get(channelCMD).send(new Discord.MessageEmbed()
                            .setDescription(`📮 **Commande (\`${id}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${message.author.id}>\n\n**-Serveur concerné : **${infoguildconcerne}\n\n**-Prestataire concerné : **${infoprestataireconcerne}`)
                            .setColor('#FF7B00')
                            .setFooter(config.version, client.user.avatarURL())).then((msg) => {
                            msg.react('📩')
                            cmd.find((cmd) => cmd.id === parseInt(id)).message = msg.id
                            // Écrire les modifications dans la base de données
                            db.set('cmd', cmd)
                            cmd.find((cmd) => cmd.id === parseInt(id)).channelmessage = msg.channel.id
                            // Écrire les modifications dans la base de données
                            db.set('cmd', cmd)
                        })
                        message.client.channels.cache.get('829720129351712790').send(`📮 **Commande (\`${id}\`) enregistrée**`)
                    }
                    if (!user && !guild) {
                        message.client.channels.cache.get('829698688288292884').send(new Discord.MessageEmbed()
                            .setDescription(`📮 **Commande (\`${id}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${message.author.id}>`)
                            .setColor('#FF7B00')
                            .setFooter(config.version, client.user.avatarURL())).then((msg) => {
                            msg.react('📩')
                            cmd.find((cmd) => cmd.id === parseInt(id)).message = msg.id
                            // Écrire les modifications dans la base de données
                            db.set('cmd', cmd)
                            cmd.find((cmd) => cmd.id === parseInt(id)).channelmessage = msg.channel.id
                            // Écrire les modifications dans la base de données
                            db.set('cmd', cmd)
                        })
                        message.client.channels.cache.get('829720129351712790').send(`📮 **Commande (\`${id}\`) enregistrée**`)
                    }
                } else {
                    channelMP.send('<:warning_visualorder:831550961625464832> **La description de votre commande doit comporter au minimum 15 caractères et au maximum 500 caractères !**')
                }
            }
        })
        collector.on('end', (_, raison) => {
            if (raison === 'time') {
                channelMP.send('<:warning_visualorder:831550961625464832> **Temps imparti écoulé, votre commande a été désactivée !**')
            }
        })
    }
}
