var socketio = require('socket.io')();
var debug = require('debug')('socket_sample:server');

function sio(server) {
	// Socket.IO
	var sio = socketio.listen(server);

	// 接続時
	sio.on('connection', function(socket) {
		// 通知受信
		socket.on('send_insChat', function(data) {
			console.log(data);
			sio.emit('recv_insChat', {
				data : data
			});
		});

		// 通知受信
		socket.on('send_delChat', function(data) {
			console.log(data);
			sio.emit('recv_delChat', {
				data : data
			});
		});

		// 切断時
		socket.on("disconnect", function() {
		});
	});
}

module.exports = sio;