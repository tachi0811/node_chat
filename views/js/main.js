
// private membar
var sio;              // socket.io
var usr_id;           // login_user_id
var select_group_id;  // select group_id

var mode = 0;       // 0: 追加, 1: 更新
var edit_chat_id;   // edit chat_id
var timer = false;  // resize flg

// ----------------------------------------
// load 時、resize 時に高さ変更
// ----------------------------------------
function chatResize(){
  var h = $(window).height();
  $("#chat-main").height(h- 160);
}

// ******************************
// jquery windows.ready
// ******************************
$(function(){

  // --------------------
  // socket.io 
  // --------------------
  sio = io.connect()

  sio.on('connect', function() {
    console.log("connected");
  });

  /* **********
    chat
  ********** */ 
  // 登録
  sio.on("recv_insChat", function(res) {
    addChat(res.data);
  });
  // 削除
  sio.on("recv_delChat", function(res) {
    delChat(res.data.chat_id);
  });
  // 更新
  sio.on("recv_updChat", function(res) {
    updChat(res.data);
  });

  /* **********
    user
  ********** */
  // 申請
  sio.on("recv_apply", function(res) {
    if (res.data.f_user_id == user_id) {
      // 承認待ちユーザーの情報を更新
      getApprovalWaitUsers();
    }
  });

  // 承認
  sio.on("recv_approval", function(res) {
    if (res.data.f_user_id == user_id) {
      // 承認待ちユーザーの情報を更新
      getApplyingUsers();
      // チャット一覧の再描画
      
    }
  });

  // --------------------
  // ローディング画面表示
  // --------------------
  showLoading();

  // --------------------
  // 複数の非同期を制御
  // --------------------
  $.when(
    setUser(),
    setGroup()
  ).done (function(){
    
  }).fail(function(){
    
  }).always(function(){
    hideLoading();
  });

  // チャットの高さのリサイズ
  chatResize();

  $(window).resize(function() {
    if (timer != false) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      console.log('window resize');
      chatResize();
    });
  });

});

// ----------------------------------------
// 初期画面表示で全タスクが修了したら入る
// ----------------------------------------
function initAllDone() {
  hideLoading();
}
