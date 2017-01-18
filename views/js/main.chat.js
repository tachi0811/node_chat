$(function () {

  // --------------------
  // ローディング画面表示
  // --------------------
  showLoading();

  // --------------------
  // 送信ボタンクリック
  // --------------------
  $("#send").click(function (e) {
    sendChat();
  });

  // --------------------
  // Cancelボタンクリック
  // --------------------
  $("#cancel").click(function (e) {
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
  endChatScroll();
}

/* ******************************
 chat の作成
****************************** */
function addChat(d) {
  var tag = getChatTag(d);
  $("#chat").append($(tag));
}

function endChatScroll() {
  $('#chat-main').animate({scrollTop: $('#chat-main')[0].scrollHeight}, 'fast');
}
/* ******************************
 chat tag 作成
******************************　*/
function getChatTag(d) {
  // 0 : user_id
  // 1 : group_id
  // 2 : chat_id
  // 3 : 削除／編集タグ 
  // 4 : ユーザー名（1文字）
  // 5 : ユーザー名
  // 6 : 時間
  // 7 : チャット本文
  var chatText = "";
  chatText += "<div class='dropdown'>";
  chatText += "<li id='chat-body' uid='{0}' gid='{1}' cid='{2}' class='left clearfix' data-toggle='dropdown'>";
  chatText += "<span class='chat-img pull-left'>";
  chatText += "<img src='http://placehold.it/50/55C1E7/fff&text={3}' alt='User Avatar' class='img-circle' />";
  chatText += "</span>";
  chatText += "<div class='chat-body clearfix'>";
  chatText += "<div class='header'>";
  chatText += "<strong class='primary-font'>";
  chatText += "{4}";
  chatText += "</strong>";
  chatText += "<small class='pull-right text-muted'>";
  chatText += "<span class='glyphicon glyphicon-time'>";
  chatText += "</span>";
  chatText += "{5}";
  chatText += "</small>";
  chatText += "</div>";
  chatText += "<pre>";
  chatText += "{6}";
  chatText += "</pre>";
  chatText += "</div>";
  chatText += "</li>";
  chatText += addDropdownMenu(d);
  chatText += "</div>";

  var usereName = d.user.user_name;
  var chatText = $.sprintf(chatText, d["user_id"], d["group_id"], d["id"], usereName.substr(0, 1), usereName, d["createdAt"], d["chat"]);
  return chatText;
}

/* ******************************
 chat List（ドロップダウンメニュー） の作成
****************************** */
function addDropdownMenu(d) {

  var menu = "";
 
  // 自分のみ削除
  if (user_id == d["user_id"]) {
    menu += "<ul role='toolbar' id='bottomMenu' class='dropdown-menu'>";
    menu += "<li>"
    menu += "<a onclick=\"editClick('{2}')\"><image src='./img/edit.svg' height='20px' width='20px' >Edit</a>";
    menu += "<a onclick=\"deleteClick('{2}')\"><image src='./img/del.svg' height='20px' width='20px' >Delete</a>";
    menu += "</li>";
    menu += "</ul>";  
  }

  return menu;
}

/* ******************************
 タグの削除
****************************** */
function delChat(chat_id) {
  $("#chat li[uid='" + user_id + "'][gid='" + select_group_id + "'][cid='" + chat_id + "']").remove();
  $('span').removeClass('selected');
  $('.dropdown-menu').slideUp('fast');
}

/* ******************************
 タグの更新
****************************** */
function updChat(d) {
  var tag = getChatTag(d);
  $("#chat li[uid='" + d["user_id"] + "'][gid='" + d["group_id"] + "'][cid='" + d["id"] + "']").replaceWith(tag);
}

/* ****************************************
chat 情報取得
params
  group_id
  group_name
  chat_type
**************************************** */
function setChat(group_id, group_name, chat_type) {

  $("#chat").empty();
  $("#group_name").text(group_name);

  $.ajax({
    type: "GET",
    charset: "UTF-8",
    data: { "group_id": group_id },
    dataType: "JSON",
    contentType: "application/JSON",
    url: "/main/chats",
    // timeout: 3000,
    // --------------------
    // 通信成功
    // --------------------
  }).done(function (res, status, xhr) {
    if (res.result == "0") {
      createChat(JSON.parse(res.data));
      select_group_id = group_id;
    } else if (res.result == "1") {

    }
    // --------------------
    // 通信失敗
    // --------------------
  }).fail(function (xhr, status, thrown) {
    window.location.href = "./sample.html";
    // --------------------
    // その他
    // --------------------
  }).always(function (xhr, status) {
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
    var data = { "group_id": select_group_id, "chat": chat };
    $.ajax({
      type: "POST",
      charset: "UTF-8",
      data: data,
      dataType: "JSON",
      // contentType: "application/JSON",
      url: "/main/insertChat/",
      // timeout: 3000,
    }).done(function (res, status, xhr) {
      if (res.result == "0") {
        clearChat();
        sio.emit('send_insChat', res.data);
      }
      else if (res.result == "1") {
        window.location.href = "./sample.html";
      }
    }).fail(function (xhr, status, thrown) {
      // error
    }).always(function (xhr, status) {
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
    var data = { "group_id": select_group_id, "chat_id": edit_chat_id, "chat": chat };
    $.ajax({
      type: "POST",
      charset: "UTF-8",
      data: data,
      dataType: "JSON",
      url: "/main/updateChat/",
      // timeout: 3000,
    }).done(function (res, status, xhr) {
      if (res.result == "0") {
        clearChat();
        sio.emit('send_updChat', res.data);
      }
      else if (res.result == "1") {
        window.location.href = "./sample.html";
      }
    }).fail(function (xhr, status, thrown) {
      // error
    }).always(function (xhr, status) {
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
  
  // 確認メッセージを表示
  // 今のままでは呼び出せない
  //showDialog('Question', 'Confirm', 'Are you sure you want to delete?');

  var data = { "chat_id": chat_id, "group_id": select_group_id, "user_id": user_id };
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
  }).done(function (res, status, xhr) {
    if (res.result == "0") {
      clearChat();
      // 削除成功
      sio.emit('send_delChat', JSON.stringify(data));
    } else if (res.result == "1") {
      // 削除失敗

    }
    // --------------------
    // 通信失敗
    // --------------------
  }).fail(function (xhr, status, thrown) {
    window.location.href = "./sample.html";
    // --------------------
    // その他
    // --------------------
  }).always(function (xhr, status) {

  });
}

/* ****************************************
chat を編集モードへ
params
  chat_id
  chat
**************************************** */
function editClick(chat_id) {
  edit_chat_id = chat_id;
  mode = 1; // 編集モードへ
  var chat = $("#chat li[uid='" + user_id + "'][gid='" + select_group_id + "'][cid='" + chat_id + "'] pre").text();
  $("#chatText").val(chat);
  $("#cancel").show();
  $("#chatText").focus();
}

/* ****************************************
chat を一回クリア（初期状態へ）
**************************************** */
function clearChat() {
  edit_chat_id = "";
  mode = 0;
  $("#chatText").val("");
  $("#cancel").hide();
  $("#chatText").focus();
}