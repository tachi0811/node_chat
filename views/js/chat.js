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
  var chatlist = $("#chatlist");
  var div = $("<div gid='" + d["group_id"] + "' uid='" + d["user_id"] + "' cid='" + d["id"] + "' class='chat-box'>").append("<div class='chat-face'>");
  var div_nm = $("<pre class='chatItem'>").text(d["chat"]);
  if ($("#user_id").val() == d["user_id"]) {
    var del = $("<input class='del' type='button' gid='" + d["group_id"] + "' cid='" + d["id"] + "' value='削除'>");
    var edit = $("<input class='edit btn btn-default' type='button' gid='" + d["group_id"] + "' cid='" + d["id"] + "' value='編集'>");
  }
  div.append(div_nm);
  div.append(del);
  div.append(edit);
  chatlist.append(div);
}