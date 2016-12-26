// ******************************
// jquery windows.ready と同じ
// ******************************
$(function(){
  // --------------------
  // ローディング画面表示
  // --------------------
  showLoading();

  // --------------------
  // socket.io 
  // --------------------
  var sio = io.connect();
  sio.on('connect', function() {
    console.log("connected");
  });
  sio.on("recieve_message", function(res) {
    addChat(res.data);
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
    if (chat != "") {
      var data = { "group_id" : 1, "chat" : chat };
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
          sio.emit('send_message', { value: res.data });
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
  // --------------------
  // 削除
  // --------------------
  $(".del").click(function(e) {
    var a = 21;
  });

  // --------------------
  // 編集
  // --------------------
  $(".edit").click(function(e) {
    var a = 21;
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
      $("#user_name").text(res.data.user_ame);
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
