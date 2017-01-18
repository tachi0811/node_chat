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

/* ****************************************
  chat change
**************************************** */
function groupClick(group_id, group_name, chat_type) {
  setChat(group_id, group_name, chat_type);
}

/* ****************************************
 add Group Click
**************************************** */
function addGroupClick() {
  $("#createGroupName").val("");
  $(".main").hide();
  $("#group-create-main").show();
}