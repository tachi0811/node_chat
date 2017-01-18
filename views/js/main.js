
// private membar
var sio;              // socket.io
var usr_id;           // login_user_id
var select_group_id;  // select group_id
var session_id;       // session_id
var timer = false;    // resize flg

// edit chat
var mode = 0;         // 0: 追加, 1: 更新
var edit_chat_id;     // edit chat_id

// edit group
var mode_group = 0;   // 0: 追加、1: 更新

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
    login
  ********** */ 
  sio.on('recv_login', function(res) {
    var data = JSON.parse(res.data);
    // 同じSessionIDで違うユーザーでログインした場合は、リロードする 
    if (user_id == data.before_user_id) {
      // 画面を閉じる
      location.reload();
      return false;
    }
  });

  /* **********
    chat
  ********** */ 
  // 登録
  sio.on("recv_insChat", function(res) {
    var data = JSON.parse(res.data);
    addChat(data);
    endChatScroll();
  });
  // 削除
  sio.on("recv_delChat", function(res) {
    var data = JSON.parse(res.data);
    delChat(data.chat_id);
  });
  // 更新
  sio.on("recv_updChat", function(res) {
    var data = JSON.parse(res.data);
    updChat(data);
  });

  /* **********
    user
  ********** */
  // 申請
  sio.on("recv_apply", function(res) {
    var data = JSON.parse(res.data);
    if (data.f_user_id == user_id) {
      // 承認待ちユーザーの情報を更新
      getApprovalWaitUsers();
    }
  });

  // 承認
  sio.on("recv_approval", function(res) {
    var data = JSON.parse(res.data);
    if (data.f_user_id == user_id) {
      // 承認待ちユーザーの情報を更新
      getApplyingUsers();
      // チャット一覧の再描画
      setGroup();
      // 友人リストの再描画
      setFriends();
    }
  });

  /* **********
    group
  ********** */
  sio.on("recv_insGroup", function(res) {
    var data = JSON.parse(res.data);
    var length = data.user_list.length;
    for (var i = 0; i < length; i++) {
      if (data.user_list[i].user_id == user_id) {
        // チャット一覧の再描画
        setGroup();
        break;
      }
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
    setGroup(),
    setFriends()
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
