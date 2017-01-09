/* ****************************************
 動的にDomを操作する場合のイベントを追加
**************************************** */
$(document).on("click", ".nav-action", (function(){
  $(".navbar-collapse").collapse('hide');
}));

/* ****************************************
  add Contact show
**************************************** */
function addContactClick() {
  $(".main").hide();
  $("#apply-main").show();
}

/* ****************************************
  chat show
**************************************** */
function nowChatClick() {
  $(".main").hide();
  $("#chat-main").show();
}