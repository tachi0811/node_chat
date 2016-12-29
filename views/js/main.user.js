$(function(){
  $("#searchContact").change(function(e){
    var searchText = $("#searchContact").val();
    if (searchText == "") {
      return;
    }
    getApplyUsers(searchText);
  });
});

/* ****************************************
 申請ユーザー 情報取得
**************************************** */
function getApplyUsers(searchText) {
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

    } else if (res.result == "1"){

    }
  }).fail(function(xhr, status, thrown){

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