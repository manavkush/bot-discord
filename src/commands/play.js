const ytdl = require("ytdl-core");
const { Client } = require("discord.js");
module.exports = play;

function play(guild, song, queue) {
	const serverQueue = queue.get(guild.id);
	console.log(song);
	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	const dispatcher = serverQueue.connection
		.play(ytdl(song.url))
		.on("finish", () => {
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on("error", function (error) {
			console.log(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	serverQueue.textChannel.send(`Started Playing **${song.title}**`);
}
