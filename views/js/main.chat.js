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
  // 0 : 削除／編集タグ 
  // 1 : ユーザー名（1文字）
  // 2 : ユーザー名
  // 3 : 時間
  // 4 : チャット本文
  var chatText = "<li uid='{5}' gid='{6}' cid='{7}' class='left clearfix'>{0}<span class='chat-img pull-left'><img src='http://placehold.it/50/55C1E7/fff&text={1}' alt='User Avatar' class='img-circle' /></span><div class='chat-body clearfix'><div class='header'><strong class='primary-font'>{2}</strong> <small class='pull-right text-muted'><span class='glyphicon glyphicon-time'></span>{3}</small></div><p>{4}</p></div></li>";
  
  // 0 : チャットID
  // 1 : チャット
  var editText = "<span class='chat-img edit_img pull-right'><a onclick=\"editClick('{0}', '{1}')\"><image src='./img/edit.svg' height='40px' width='40px' ></a><a  onclick=\"deleteClick('{0}')\"></image><image src='./img/del.svg' height='40px' width='40px' ></image></a></span>";
  if (user_id != d["user_id"]) {
    editText = "";
  } else {
    editText = $.sprintf(editText, d["id"], d["chat"]);
  }
  var usereName = $("#user_name").text();
  chatText = $.sprintf(chatText, editText, usereName.substr(0, 1), usereName, d["createdAt"], d["chat"], d["user_id"], d["group_id"], d["id"]);
  $("#chat").append($(chatText));
}

/* ******************************
 タグの削除
****************************** */
function delChat(user_id, group_id, chat_id) {
  $("li[uid='" + user_id + "'][gid='" + group_id + "'][cid='" + chat_id + "']").remove();
}

/* ******************************
 タグの更新
****************************** */
function updChat(){

}

/* ****************************************
chat 情報取得
params
  group_id
**************************************** */
function setChat(group_id) {

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

/* ******************************
 Chat Send
****************************** */
function sendChatInsert() {
  var chat = $("#chatText").val().trim();
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
}

/* ******************************
 Chat Send
****************************** */
function sendChatUpdate() {
  var chat = $("#chatText").val().trim();
  if (chat != "") {
    var data = { "group_id" : group_id, "chat_id" : edit_chat_id, "chat" : chat };
    $.ajax({
      type: "POST",
      charset: "UTF-8",
      data: data,
      dataType: "JSON",
      url: "/main/updateChat/",
    // timeout: 3000,
    }).done(function(res, status, xhr) {
      if (res.result == "0") {
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
  user_id
  group_id
  chat_id
**************************************** */
function deleteClick(chat_id) {
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

/* ****************************************
chat 情報更新
params
  user_id
  group_id
  chat_id
  chat
**************************************** */
function editClick(user_id, group_id, chat_id, chat) {
  edit_chat_id =  chat_id;
  $("#chatText").val(chat);
  $("#cancel").show();
}
