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
    delChat(res.data.chat_id);
  });
  // 更新
  sio.on("recv_updChat", function(res) {
    updChat(res.data);
  });

  // --------------------
  // 送信ボタンクリック
  // --------------------
  $("#send").click(function(e) {
    sendChat();
  });

  // --------------------
  // Cancelボタンクリック
  // --------------------
  $("#cancel").click(function(e) {
    clearChat();
  });

});

/* ******************************
 chat List の作成
****************************** */
function createChat(data) {
  var dataLength = data.length;
  for (i = 0; i < dataLength; i++) {
    var d = data[i];
    addChat(d);
  }
}
/* ******************************
 chat の作成
****************************** */
function addChat(d) {
  var tag = getChatTag(d);
  $("#chat").append($(tag));
}

/* ******************************
 chat tag 作成
******************************　*/
function getChatTag(d){
  // 0 : user_id
  // 1 : group_id
  // 2 : chat_id
  // 3 : chat
  // 4 : 削除／編集タグ 
  // 5 : ユーザー名（1文字）
  // 6 : ユーザー名
  // 7 : 時間
  // 8 : チャット本文
  var chatText = "";
  chatText += "<li uid='{0}' gid='{1}' cid='{2}' class='left clearfix'>";
  chatText += "{3}";
  chatText += "<span class='chat-img pull-left'>";
  chatText += "<img src='http://placehold.it/50/55C1E7/fff&text={4}' alt='User Avatar' class='img-circle' />";
  chatText += "</span>";
  chatText += "<div class='chat-body clearfix'>";
  chatText += "<div class='header'>";
  chatText += "<strong class='primary-font'>";
  chatText += "{5}";
  chatText += "</strong>";
  chatText += "<small class='pull-right text-muted'>";
  chatText += "<span class='glyphicon glyphicon-time'>";
  chatText += "</span>";
  chatText += "{6}";
  chatText += "</small>";
  chatText += "</div>";
  chatText += "<pre>";
  chatText += "{7}";
  chatText += "</pre>";
  chatText += "</div>";
  chatText += "</li>";
  
  // 0 : チャットID
  // 1 : チャット
  var editText = "";
  editText += "<span class='chat-img edit_img pull-right'>";
  editText += "<a onclick=\"editClick('{0}', '{1}')\">";
  editText += "<image src='./img/edit.svg' height='40px' width='40px' >";
  editText += "</a>";
  editText += "<a onclick=\"deleteClick('{0}')\">";
  editText += "</image>";
  editText += "<image src='./img/del.svg' height='40px' width='40px' >";
  editText += "</image>";
  editText += "</a>";
  editText += "</span>";

  if (user_id != d["user_id"]) {
    editText = "";
  } else {
    editText = $.sprintf(editText, d["id"], d["chat"]);
  }
  var usereName = d.user.user_name;
  var chatText = $.sprintf(chatText, d["user_id"], d["group_id"], d["id"], editText, usereName.substr(0, 1), usereName, d["createdAt"], d["chat"]);
  return chatText;
}

/* ******************************
 タグの削除
****************************** */
function delChat(chat_id) {
  $("li[uid='" + user_id + "'][gid='" + group_id + "'][cid='" + chat_id + "']").remove();
}

/* ******************************
 タグの更新
****************************** */
function updChat(d){
  var tag = getChatTag(d);
  $("li[uid='" + d["user_id"] + "'][gid='" + d["group_id"] + "'][cid='" + d["id"] + "']").replaceWith(tag);
}

/* ****************************************
chat 情報取得
params
  group_id
  group_name
**************************************** */
function setChat(group_id, group_name) {

  $("#chat").empty();
  $("#group_name").text(group_name);

  $.ajax({
    type: "GET",
    charset: "UTF-8",
    data: {"group_id": group_id},
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
      select_group_id = group_id;
    } else if (res.result == "1") {
      
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
    clearChat();
  });
}

/* ******************************
 Chat Send
****************************** */
function sendChat() {
  if (mode == 0) {
    sendChatInsert();
  } else {
    sendChatUpdate();
  }
}

/* ******************************
 Chat Send ins
****************************** */
function sendChatInsert() {
  var chat = $("#chatText").val().trim();
  if (chat != "") {
    var data = { "group_id" : select_group_id, "chat" : chat };
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
        clearChat();
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
}

/* ******************************
 Chat Send upd
****************************** */
function sendChatUpdate() {
  var chat = $("#chatText").val().trim();
  if (chat != "") {
    var data = { "group_id" : select_group_id, "chat_id" : edit_chat_id, "chat" : chat };
    $.ajax({
      type: "POST",
      charset: "UTF-8",
      data: data,
      dataType: "JSON",
      url: "/main/updateChat/",
    // timeout: 3000,
    }).done(function(res, status, xhr) {
      if (res.result == "0") {
        clearChat();
        sio.emit('send_updChat', res.data );
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
}

/* ****************************************
chat Delete
params
  chat_id
**************************************** */
function deleteClick(chat_id) {
  var data = {"chat_id": chat_id, "group_id": select_group_id, "user_id": user_id};
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

/* ****************************************
chat を編集モードへ
params
  chat_id
  chat
**************************************** */
function editClick(chat_id, chat) {
  edit_chat_id =  chat_id;
  mode = 1; // 編集モードへ
  $("#chatText").val(chat);
  $("#cancel").show();
  $("#chatText").focus();
}

/* ****************************************
chat を一回クリア（初期状態へ）
**************************************** */
function clearChat() {
  edit_chat_id =  "";
  mode = 0;
  $("#chatText").val("");
  $("#cancel").hide();
  $("#chatText").focus();
}