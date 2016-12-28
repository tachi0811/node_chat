
// private membar
var sio;            // socket.io
var usr_id;         // login_user_id
var group_id;       // select group_id

var mode = 0;       // 0: 追加, 1: 更新
var edit_chat_id;   // edit chat_id
var timer = false;  // resize flg

// ----------------------------------------
// load 時、resize 時に高さ変更
// ----------------------------------------
function chatResize(){
  var h = $(window).height();
  $(".panel-body").height(h- 170);
}

// ******************************
// jquery windows.ready
// ******************************
$(function(){

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
