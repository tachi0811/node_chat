$(function(){

  /*
    申請中ユーザーの表示
  */
  getApplyingUsers();

  /*
    申請ユーザー Text Changed 
  */
  $("#searchContact").change(function(e){
    var searchText = $("#searchContact").val();
    if (searchText == "") {
      return;
    }
    getApplyUsers(searchText);
  });
});

/*
  add Contact show
*/
function addContactClick() {
  $(".main").hide();
  $("#apply-main").show();
}

/*
  chat show
*/
function nowChatClick() {
  $(".main").hide();
  $("#chat-main").show();
}

/*
 Apply Click
 data : user_id
*/
function applyClick(user_f_id) {

}

/*
 申請するユーザーリストを作成
 data : users
*/
function setApplyList(data, isApplying) {
  var dataLength = data.length;
  var listText = "";
  var buttonText = "";
  //
  // 0 : id -- 申請前 user_id
  // 1 : button tag
  // 2 : email
  // 3 : name
  //
  listText += "<li class='list-group-item' fuid='{0}'>";
  listText += "{1}";
  listText += "<div class='approval-info'>";
  listText += "<span class='text-muted'>";
  listText += "{2}"; // email
  listText += "</span>";
  listText += "<h5>";
  listText += "<span class=''>";
  listText += "{3}"; // name
  listText += "</span>";
  listText += "</h3>";
  listText += "</div>";
  listText += "</li>"
  buttonText = "<input type='button' onclick='applyClick({0})' class='btn btn-primary' value='申請' style='float:right !important;'>";
  // List All Delete
  if (dataLength > 0) {
    for(var i = 0; i < dataLength; i++) {
      var d = data[i];
      if (isApplying) {
        buttonText = "";
      } else {
        buttonText = $.sprintf(buttonText, d["id"]);
      }
      listText = $.sprintf(listText, d["id"], buttonText, d["email"], d["user_name"]);
    }
  } else {
    listText = $.sprintf(listText, "", "", "", "User DATA Not Found");
  }
  if (isApplying) {
    $("#applying-list").append($(listText));
  } else {
    $("#apply-list").append($(listText));
  }

}

/* ****************************************
 申請ユーザー 情報取得
**************************************** */
function getApplyUsers(searchText) {
  // リストをクリアして、loading 画面を表示する
  $("#apply-list").hide();
  $("#apply-list").empty();
  $("#apply-loading").show();
  $.ajax({
    type: "GET",
    charset: "UTF-8",
    data: {"search": searchText},
    dataType: "JSON",
    contentType: "application/JSON",
    url: "/main/applyUsers",
    // timeout: 3000,
  }).done(function(res, status, xhr){
    if (res.result == "0") {
      // 申請リスト
      setApplyList(res.data, false);
    } else if (res.result == "1"){
      // 
    }
  }).fail(function(xhr, status, thrown){

  }).always(function(xhr, status){
    $("#apply-list").show();
    $("#apply-loading").hide();
  });
}

/* ****************************************
 申請中ユーザー 情報取得
**************************************** */
function getApplyingUsers() {
  // リストをクリアして、loading 画面を表示する
  $("#applying-list").hide();
  $("#applying-list").empty();
  $("#applying-loading").show();
  $.ajax({
    type: "GET",
    charset: "UTF-8",
    data: {"search": searchText},
    dataType: "JSON",
    contentType: "application/JSON",
    url: "/main/applyingUsers",
    // timeout: 3000,
  }).done(function(res, status, xhr){
    if (res.result == "0") {
      // 申請リスト
      setApprovalList(res.data, true);
    } else if (res.result == "1"){
      // 
    }
  }).fail(function(xhr, status, thrown){

  }).always(function(xhr, status){
    $("#applying-list").show();
    $("#applying-loading").hide();
  });
}

/* ****************************************
 login 情報取得
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
      // 変数に格納
      user_id = res.data.user_id;
      group_id = res.data.my_chat_group_id;
      // 初期表示はMyChat を表示
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