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
		socket.on('notice', function(data) {
			console.log(data);
			// すべてのクライアントへ通知を送信
			// ブロードキャスト
			// socket.broadcast.emit('recieve', {
			sio.emit('recieve', {
				type : data.type,
				user : data.user,
				value : data.value,
// 				time : dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
			});
		});

		// 切断時
		socket.on("disconnect", function() {
		});
	});
}

module.exports = sio;