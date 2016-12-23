var socketio = require('socket.io')();
// var dateformat = require('dateformat');
var debug = require('debug')('socket_sample:server');

function sio(server) {
	// Socket.IO
	var sio = socketio.listen(server);
	// sio.set('transports', [ 'websocket' ]);

	// 接続時
	sio.on('connection', function(socket) {
		// 通知受信
		socket.on('send_message', function(data) {
			console.log(data);
			// すべてのクライアントへ通知を送信
			// ブロードキャスト
			// socket.broadcast.emit('recieve', {
			sio.emit('recieve_message', {
				data : data
			});
		});

		// 切断時
		socket.on("disconnect", function() {
		});
	});
}

module.exports = sio;