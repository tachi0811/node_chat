
// private membar
var sio;
var timer = false;

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
  // socket.io 
  // --------------------
  sio = io.connect()
  sio.on('connect', function() {
    console.log("connected");
  });
  // 登録
  sio.on("recv_insChat", function(res) {
    addChat(res.data);
  });
  // 削除
  sio.on("recv_delChat", function(res) {
    delChat(res.data.user_id, res.data.group_id, res.data.chat_id);
  });
  // 更新
  sio.on("recv_delChat", function(res) {
    delChat(res.data.user_id, res.data.group_id, res.data.chat_id);
  });

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

  // --------------------
  // 送信ボタンクリック
  // --------------------
  $("#send").click(function(e) {
    var chat = $("#chatText").val().trim();
    var group_id = $("#group_id").val();
    if (chat != "") {
      var data = { "group_id" : group_id, "chat" : chat };
      $.ajax({
        type: "POST",
        charset: "UTF-8",
        data: data,
        dataType: "JSON",
        // contentType: "application/JSON",
        url: "/main/insertChat/",
      // timeout: 3000,
      }).done(function(res, status, xhr) {
        if (res.result == "0") {
          sio.emit('send_insChat', res.data );
        }
        else if (res.result == "1") {
          window.location.href = "./sample.html";
        }
      }).fail(function(xhr, status, thrown) {
        // error
      }).always(function(xhr, status) {
        // 
      });
    }
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

/* ****************************************
* login 情報取得
* *****************************************
* 
* 
**************************************** */
function setUser() {
  $.ajax({
    type: "GET",
    charset: "UTF-8",
    data: "",
    dataType: "JSON",
    contentType: "application/JSON",
    url: "/main/loginUser",
    // timeout: 3000,
  // --------------------
  // 通信成功
  // --------------------
  }).done(function(res, status, xhr) {
    if (res.result == "0") {
      $("#user_name").text(res.data.user_name);
      $("#group_name").text(res.data.my_chat_group_name);
      $("#user_id").val(res.data.user_id);
      // 選択中の group_id を設定する
      $("#group_id").val(res.data.my_chat_group_id);
      setChat(res.data.my_chat_group_id);
    } else if (res.result == "1") {
      window.location.href = "./sample.html";
    }
  // --------------------
  // 通信失敗
  // --------------------
  }).fail(function(xhr, status, thrown) {
    window.location.href = "./sample.html";
  // --------------------
  // その他
  // --------------------
  }).always(function(xhr, status){
    
  });
}

/* ****************************************
 group情報取得
**************************************** */
function setGroup() {
  $.ajax({
    type: "GET",
    charset: "UTF-8",
    data: "",
    dataType: "JSON",
    contentType: "application/JSON",
    url: "/main/groups",
    // timeout: 3000,
  // --------------------
  // 通信成功
  // --------------------
  }).done(function(res, status, xhr) {
    if (res.result == "0") {
      createSideBar(JSON.parse(res.data));
    } else if (res.result == "1") {
      window.location.href = "./sample.html";
    }
  // --------------------
  // 通信失敗
  // --------------------
  }).fail(function(xhr, status, thrown) {
    window.location.href = "./sample.html";
  // --------------------
  // その他
  // --------------------
  }).always(function(xhr, status){
    
  });
}

/* ****************************************
chat 情報取得
**************************************** */
function setChat(id) {

  $.ajax({
    type: "GET",
    charset: "UTF-8",
    data: {"group_id": id},
    dataType: "JSON",
    contentType: "application/JSON",
    url: "/main/chats",
    // timeout: 3000,
  // --------------------
  // 通信成功
  // --------------------
  }).done(function(res, status, xhr) {
    if (res.result == "0") {
      createChat(JSON.parse(res.data));
    } else if (res.result == "1") {
      // window.location.href = "./sample.html";
    }
  // --------------------
  // 通信失敗
  // --------------------
  }).fail(function(xhr, status, thrown) {
    window.location.href = "./sample.html";
  // --------------------
  // その他
  // --------------------
  }).always(function(xhr, status){
    hideLoading();
  });
}

/* ****************************************
chat 情報削除
**************************************** */
function deleteClick(user_id, group_id, chat_id) {
  var data = {"chat_id": chat_id, "group_id": group_id, "user_id": user_id};
  $.ajax({
    type: "POST",
    charset: "UTF-8",
    data: data,
    dataType: "JSON",
    url: "/main/deleteChat",
    // timeout: 3000,
  // --------------------
  // 通信成功
  // --------------------
  }).done(function(res, status, xhr) {
    if (res.result == "0") {
      // 削除成功
      sio.emit('send_delChat', data);
    } else if (res.result == "1") {
      // 削除失敗

    }
  // --------------------
  // 通信失敗
  // --------------------
  }).fail(function(xhr, status, thrown) {
    window.location.href = "./sample.html";
  // --------------------
  // その他
  // --------------------
  }).always(function(xhr, status){
    
  });
}