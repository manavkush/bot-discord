require("dotenv").config();
const ytdl = require("ytdl-core");
const { Client } = require("discord.js");
const client = new Client();
const PREFIX = "$";

const play = require("./commands/play");

client.login(process.env.discordjs_bot_token);
const queue = new Map(); // Maps the server to it's queue

client.on("ready", () => {
	console.log("Ready");
	client.user.setStatus("use $play <link>");
});

client.on("message", async (message) => {
	// Basic Checks
	if (message.author.bot) return;
	if (!message.content.startsWith(PREFIX)) return;

	const serverQueue = queue.get(message.guild.id); // Get the server's queue from the map(queue)

	// functionality
	const args = message.content.substr(PREFIX.length).trim().split(/\s+/); // Args is an array
	const cmd_name = args[0];
	console.log(args);

	if (cmd_name === "play") {
		// No song provided
		if (args.length <= 1) {
			return message.channel.send("Song ka link kaun dega TC.");
		}
		execute(message, serverQueue);
	} else if (cmd_name === "stop") {
		stop(message, serverQueue);
	} else if (cmd_name === "skip") {
		skip(message, serverQueue);
	} else {
		message.channel.send(
			"Aisi koi command nahi hai. Nasha Mukti Kendra jaane ka samay aagyaa hai."
		);
	}
	return;
});
//======================EXECUTE FUNCTION============================================
async function execute(message, serverQueue) {
	const args = message.content.substr(PREFIX.length).trim().split(/\s+/);
	// Args is an array
	const cmd_name = args[0];

	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel)
		return message.channel.send("You need to be in a voice channel to play music, TC.");

	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
		return message.channel.send("Permissions toh de TC. Bol bhi nahi sakta mai.");
	}
	// console.log(args);
	const songinfo = await ytdl.getInfo(args[1]);
	// console.log(songinfo);
	const song = {
		title: songinfo.videoDetails.title,
		url: songinfo.videoDetails.video_url,
	};
	// console.log(song);

	if (!serverQueue) {
		// If song is not playing

		const queueConstruct = {
			// queueConstruct object
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueConstruct);
		//Mapping the server to the queue

		// Adding the song to the song array
		queueConstruct.songs.push(song);

		// Now we try to connect to the voice channel
		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0], queue);
		} catch (err) {
			// If the bot fails to join the voice Channel
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		// If song already playing
		serverQueue.songs.push(song);
		// console.log(serverQueue.songs);
		return message.channel.send(`${song.title} has been added to the queue`);
	}
}
//=================================== Play Function =====================================
// function play(guild, song) {
// 	const serverQueue = queue.get(guild.id);
// 	console.log(song);
// 	if (!song) {
// 		serverQueue.voiceChannel.leave();
// 		queue.delete(guild.id);
// 		return;
// 	}
// 	const dispatcher = serverQueue.connection
// 		.play(ytdl(song.url))
// 		.on("finish", () => {
// 			serverQueue.songs.shift();
// 			play(guild, serverQueue.songs[0]);
// 		})
// 		.on("error", function (error) {
// 			console.log(error);
// 		});
// 	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
// 	serverQueue.textChannel.send(`Started Playing **${song.title}**`);
// }
