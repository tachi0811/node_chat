//
// chat area 作成
//
function createChat(data) {
  var dataLength = data.length;
  for (i = 0; i < dataLength; i++) {
    var d = data[i];
    addChat(d);
  }
}

function addChat(d) {
  var chatlist = $("#chatlist");
  var div = $("<div gid='" + d["group_id"] + "' uid='" + d["user_id"] + "' cid='" + d["id"] + "' class='chat-box'>").append("<div class='chat-face'>");
  var div_nm = $("<pre class='chatItem'>").text(d["chat"]);
  div.append(div_nm);
  chatlist.append(div);
}