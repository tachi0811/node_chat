$(function(){

  /*
    申請中ユーザーの表示
  */
  getApplyingUsers();
  /*
    承認待ちユーザーの表示
  */
  getApprovalWaitUsers();
  /*
    申請ユーザー Text Changed 
  */
  $("#searchContact").change(function(e){
    getApplyUsers();
  });
});

/*
 Apply Click - 申請ボタンクリック
 data : f_user_id
*/
function applyClick(f_user_id) {
  var data = {"f_user_id": f_user_id, "user_id" : user_id}; 
  $.ajax({
    type: "POST",
    charset: "UTF-8",
    data: data,
    dataType: "JSON",
    url: "/main/insertFriend",
    // timeout: 3000,
  }).done(function(res, status, xhr){
    if (res.result == "0") {
      // 申請リストの更新
      getApplyUsers();
      getApplyingUsers();
      // 承認待ちのユーザー情報を送信
      sio.emit('send_apply', JSON.parse(data) );
    } else if (res.result == "1"){
      // エラーメッセージ
    }
  }).fail(function(xhr, status, thrown){
    // 
  }).always(function(xhr, status){
    //
  });
}

/*
 approval Click - 承認ボタンクリック
 data : f_user_id, f_user_name
*/
function approvalClick(f_user_id, f_user_name) {
  var data = { "f_user_id" : f_user_id, "f_user_name" : f_user_name };
  $.ajax({
    type: "POST",
    charset: "UTF-8",
    data: data,
    dataType: "JSON",
    url: "/main/updateApproval",
    // timeout: 3000,
  }).done(function(res, status, xhr){
    if (res.result == "0") {
      // 承認待ちリストの更新
      getApprovalWaitUsers();
      // group 情報の更新
      setGroup();
      // 申請中ユーザー情報を送信
      sio.emit('send_approval', JSON.parse(data) );
    } else if (res.result == "1"){
      // エラー処理
    }
  }).fail(function(xhr, status, thrown){
    // 
  }).always(function(xhr, status){
    //
  });
}

/*
 申請するユーザーリストを作成
 data : users
*/
function setApplyList(data, approval) {
  var dataLength = data.length;
  var listText = "";
  var buttonText = "";
  var tag = "";
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
  listText += "</h5>";
  listText += "</div>";
  listText += "</li>"
  buttonText = "<input type='button' onclick=\"{0}Click('{1}', '{2}')\" class='btn btn-primary btn-sm' value='{3}' style='float:right !important;'>";
  // List All Delete
  if (dataLength > 0) {
    for(var i = 0; i < dataLength; i++) {
      var btnTag = "";
      var d = data[i];
      if (approval == 0) {
        btnTag = "";
      } else if(approval == 1) {
        // 承認ボタン
        btnTag = $.sprintf(buttonText,'approval', d["id"], d["user_name"], '承認');
      } else {
        // 申請ボタン
        btnTag = $.sprintf(buttonText,'apply', d["id"], d["user_name"], '申請');
      }
      tag += $.sprintf(listText, d["id"], btnTag, d["email"], d["user_name"]);
    }
  } else {
    tag += $.sprintf(listText, "", "", "", "User DATA Not Found"); 
  }
  setApply(approval, tag);
}

function setApply(approval, tag) {
  if (approval == 0) {
    $("#applying-list").append($(tag));
  } else if(approval == 1) {
    $("#approval-wait-list").append($(tag));
  } else { 
    $("#apply-list").append($(tag));
  }
}

/* ****************************************
 申請ユーザー 情報取得
**************************************** */
function getApplyUsers() {
  var searchText = $("#searchContact").val();
  if (searchText == "") {
    return;
  }

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
      setApplyList(JSON.parse(res.data), 9);
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
 申請ユーザー 情報取得
**************************************** */
function getApplyingUsers() {
  $("#applying-list").hide();
  $("#applying-list").empty();
  $("#applying-loading").show();
  $.when(
    getApprovalUsers('0')
  ).done (function(){
    
  }).fail(function(){
    
  }).always(function(){
    $("#applying-list").show();
    $("#applying-loading").hide();
  });
}

/* ****************************************
 承認待ちユーザー 情報取得
**************************************** */
function getApprovalWaitUsers() {
  $("#approval-wait-list").hide();
  $("#approval-wait-list").empty();
  $("#approval-wait-loading").show();
  $.when(
    getApprovalUsers('1')
  ).done (function(){
    // 成功時の処理
  }).fail(function(){
    // 失敗時の処理
  }).always(function(){
    $("#approval-wait-list").show();
    $("#approval-wait-loading").hide();
  });
}

/* ****************************************
 申請中ユーザー 情報取得
**************************************** */
function getApprovalUsers(approval) {
  
  $.ajax({
    type: "GET",
    charset: "UTF-8",
    data: {"approval": approval},
    dataType: "JSON",
    contentType: "application/JSON",
    url: "/main/approvalUsers",
    // timeout: 3000,
  }).done(function(res, status, xhr){
    if (res.result == "0") {
      // 申請リスト
      setApplyList(JSON.parse(res.data), approval);
    } else if (res.result == "1"){
      // 
    }
  }).fail(function(xhr, status, thrown){
    throw(thrown);
  }).always(function(xhr, status){

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
      var data = JSON.parse(res.data);
      $("#user_name").text(data.user_name);
      // 変数に格納
      user_id = data.user_id;
      session_id = data.session_id;
      // 初期表示はMyChat を表示
      setChat(data.my_chat_group_id, data.my_chat_group_name);
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