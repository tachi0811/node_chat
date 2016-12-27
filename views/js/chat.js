// ------------------------------
// chat の作成
// ------------------------------
function createChat(data) {
  var dataLength = data.length;
  for (i = 0; i < dataLength; i++) {
    var d = data[i];
    addChat(d);
  }
}
// ------------------------------
// 1chat の作成
// ------------------------------
function addChat(d) {
  // 0 : 削除／編集タグ 
  // 1 : ユーザー名（1文字）
  // 2 : ユーザー名
  // 3 : 時間
  // 4 : チャット本文
  var chatText = "<li uid='{5}' gid='{6}' cid='{7}' class='left clearfix'>{0}<span class='chat-img pull-left'><img src='http://placehold.it/50/55C1E7/fff&text={1}' alt='User Avatar' class='img-circle' /></span><div class='chat-body clearfix'><div class='header'><strong class='primary-font'>{2}</strong> <small class='pull-right text-muted'><span class='glyphicon glyphicon-time'></span>{3}</small></div><p>{4}</p></div></li>";
  
  // 0 : ユーザーID 
  // 1 : グループID
  // 2 : チャットID
  var editText = "<span class='chat-img edit_img pull-right'><a onclick=\"editClick('{0}','{1}','{2}')\"><image src='./img/edit.svg' height='40px' width='40px' ></a><a  onclick=\"deleteClick('{0}','{1}','{2}')\"></image><image src='./img/del.svg' height='40px' width='40px' ></image></a></span>";
  if ($("#user_id").val() != d["user_id"]) {
    editText = "";
  } else {
    editText = $.sprintf(editText, d["user_id"], d["group_id"], d["id"]);
  }
  var usereName = $("#user_name").text();
  chatText = $.sprintf(chatText, editText, usereName.substr(0, 1), usereName, d["createdAt"], d["chat"], d["user_id"], d["group_id"], d["id"]);
  $("#chat").append($(chatText));
}

// 編集処理
function editClick(user_id, group_id, chat_id) {
  
}

// 削除処理
function deleteClick(user_id, group_id, chat_id) {

}