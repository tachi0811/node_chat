
/* ****************************************
 CreateFriends
 params
   data
**************************************** */
function CreateFriends(data) {
  $("#friends-list").empty();
  var dataLength = data.length;
  var listText = "";
  var checkboxText = "";
  var tag = "";
  //
  // 0 : f_user_id
  // 1 : email
  // 2 : name
  //
  listText += "<li class='list-group-item' fuid='{0}'>";
  listText += "<div class='approval-info'>";
  listText += "<span class='text-muted'>";
  listText += "{1}"; // email
  listText += "</span>";
  listText += "<h5>";
  listText += "{2}"; 
  listText += "</h5>";
  listText += "</div>";
  listText += "</li>"

  checkboxText += "<div class='checkbox'>";
  checkboxText += "<label>";
  checkboxText += "<input type='checkbox' class='group_user' fuid='{0}'>";
  checkboxText += "{1}"; // name
  checkboxText += "</label>";
  checkboxText += "</div>";

  // List All Delete
  if (dataLength > 0) {
    for(var i = 0; i < dataLength; i++) {
      var d = data[i];
      var chkTag = $.sprintf(checkboxText, d["f_user_id"], d.user["user_name"]);
      tag += $.sprintf(listText, d["f_user_id"], d.user["email"], chkTag);
    }
  } else {
    tag += $.sprintf(listText, "", "", "User DATA Not Found"); 
  }
  $("#friends-list").append(tag);

}

/* ****************************************
 setFriends
**************************************** */
function setFriends() {
  $.ajax({
    type: "GET",
    charset: "UTF-8",
    data: "",
    dataType: "JSON",
    contentType: "application/JSON",
    url: "/main/friends",
    // timeout: 3000,
  // --------------------
  // 通信成功
  // --------------------
  }).done(function(res, status, xhr) {
    if (res.result == "0") {
      CreateFriends(JSON.parse(res.data));
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
 groups tag create
**************************************** */
function createGroup(data) {

  var dataLength = data.length;
  $("#groupListItems").empty();

  for (i = 0; i < dataLength; i++) {
    var d = data[i];
    var groupText = "";
    groupText += "<li>";
    groupText += "<a herf='#' gid='{0}' ct='{2}' class=\"nav-action\" onclick=\"groupClick('{0}', '{1}', '{2}')\" class='groupItem'>";
    groupText += "{1}";
    groupText += "</a>";
    groupText += "</li>";
    groupText = $.sprintf(groupText, d["id"], d["group_name"], d["chat_type"]);
    $("#groupListItems").append($(groupText));
  }
}

/* ****************************************
 get groups
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
      createGroup(JSON.parse(res.data));
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
 get groups
**************************************** */
function insertGroup() {

  var groupName = $("#createGroupName").val().trim(); 

  if ($("#createGroupName").val().trim() == "") {
    return false;
  }

  var ret = getInsertGroupUser();
  var data = JSON.stringify({ "group_name": groupName, "user_list" : ret });
  
  $.ajax({
    type: "POST",
    charset: "UTF-8",
    data: data,
    dataType: "JSON",
    contentType: "application/JSON",  // 文字列をJSONとして送るときに付ける
    url: "/main/insertGroup",
    // timeout: 3000,
  // --------------------
  // 通信成功
  // --------------------
  }).done(function(res, status, xhr) {
    if (res.result == "0") {
      // チャット一覧の再描画
      setGroup();
      nowChatClick();
      
      sio.emit('send_insGroup', data);
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
get insert group user
return
  json [{ "user_id" : xxxx } xxxx] 
**************************************** */
function getInsertGroupUser() {
  var ret = [];
  // 自ユーザーの設定
  ret.push({ "user_id" : user_id });

  var users = $(".group_user:checked");
  for (var i = 0; i < users.length; i++) {
    ret.push({ "user_id" : $(users[i]).attr('fuid') });
  }
  return ret;
}