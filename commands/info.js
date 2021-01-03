const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        let prefix = '!gb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        if (dbLogs.has('logs')) {
            const logs = dbLogs.get('logs')
            const total = logs.length
            const creation = db.all().filter((objet) => objet.key.startsWith('crea_')).length
            const preuve = db.all().filter((objet) => objet.key.startsWith('pr_')).length
            const logsDay = logs.filter(log => log.date >= (Date.now() - 24 * 60 * 60 * 1000)).length
            const logscmd = logs.filter(log => log.cmd === ('cmd')).length
            const logsdescript = logs.filter(log => log.cmd === ('descript')).length
            const logshelp = logs.filter(log => log.cmd === ('help')).length
            const logsinfo = logs.filter(log => log.cmd === ('info')).length
            const logslevel = logs.filter(log => log.cmd === ('level')).length
            const logsviewcrea = logs.filter(log => log.cmd === ('viewcrea')).length
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('🔽 Information relative au bot 🔽')
                .setDescription('Le nombre de commandes tapées depuis le 13/10/20 est de **' + total + '** commandes ! \n\nCommandes tapées aujourd\'hui : **' + logsDay + '**\n\n 📡 Ping 📡 de Graph Bot : **' + client.ws.ping + '**ms\n\n**❤️ MERCI ❤️**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                .addFields(
                    { name: 'créations enregistrées', value: creation + ' créations', inline: true },
                    { name: 'preuves enregistrées', value: preuve + ' preuves', inline: true },
                    { name: 'commande : cmd', value: 'tapées ' + logscmd + ' fois', inline: true },
                    { name: 'commande : descript', value: 'tapées ' + logsdescript + ' fois', inline: true },
                    { name: 'commande : help', value: 'tapées ' + logshelp + ' fois', inline: true },
                    { name: 'commande : info', value: 'tapées ' + logsinfo + ' fois', inline: true },
                    { name: 'commande : level', value: 'tapées ' + logslevel + ' fois', inline: true },
                    { name: 'commande : viewcrea', value: 'tapées ' + logsviewcrea + ' fois', inline: true }
                )
                .setColor('00FF00')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
