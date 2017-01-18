var socketio = require('socket.io')();
var debug = require('debug')('socket_sample:server');

function sio(server) {
	// Socket.IO
	var sio = socketio.listen(server);

	// 接続時
	sio.on('connection', function(socket) {

		// ログインユーザーが、同じセッションIDで別ユーザーでログインする場合の対応
		socket.on('send_login', function(data) {
			console.log(data);
			sio.emit('recv_login', { 
				data: data 
			});
		});

		// グループ作成
		socket.on('send_insGroup', function(data) {
			console.log(data);
			sio.emit('recv_insGroup', { data: data });
		});

		// 通知受信(チャット登録)
		socket.on('send_insChat', function(data) {
			console.log(data);
			sio.emit('recv_insChat', {
				data : data
			});
		});

		// 通知受信(チャット削除)
		socket.on('send_delChat', function(data) {
			console.log(data);
			sio.emit('recv_delChat', {
				data : data
			});
		});

		// 通知受信(チャット更新)
		socket.on('send_updChat', function(data) {
			console.log(data);
			sio.emit('recv_updChat', {
				data : data
			});
		});

		// 申請通知
		socket.on('send_apply', function(data) {
			console.log(data);
			sio.emit('recv_apply', {
				data: data
			});
		});

		// 承認通知
		socket.on('send_approval', function(data) {
			console.log(data);
			sio.emit('recv_approval', {
				data: data
			});
		});

		// 切断時
		socket.on("disconnect", function() {
		});
	});
}

module.exports = sio;