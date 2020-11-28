require('dotenv').config();

// console.log(process.env.discordjs_bot_token)

const { Client } = require('discord.js');
const client = new Client();
const PREFIX = "$";

client.login(process.env.discordjs_bot_token);

client.on('ready', function () {
    console.log(`${client.user.username}`);
})

client.on('message', function (message) {

    // Basic Checks
    if (message.author.bot)
        return;
    if (!message.content.startsWith(PREFIX))
        return;

    // functionality
    const args = message.content.substr(PREFIX.length).trim().split(/\s+/);   // Args is an array
    const cmd_name = args[0];
    // console.log(args);

    if (cmd_name === "play") {
        // No song provided
        if (args.length <= 1) {
            message.channel.send("Please provide the song link");
            return;
        }
        execute(message, serverQueue);

    } else if (cmd_name === "stop") {
        skip(message, serverQueue);
    } else if (cmd_name === "skip") {
        skip(message, serverQueue);
    } else {
        message.channel.send("Send a valid command");
    }
    const queue = new Map();
    //EXECUTE FUNCTION
    function execute(message, serverQueue) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send("You need to be in a voice channel to play music, TC.");
        }
    }





    args[1] = args[1].replace(/[<@!>]/g, '');

    const member = message.guild.members.cache.get(args[1]);
    console.log(member);
    if (member) {
        // member.kick("You were a bad boy");
        message.channel.send(`${member.user.username} was kicked for being a bad boy`);
    } else {
        message.channel.send("No such member found");
    }

});
