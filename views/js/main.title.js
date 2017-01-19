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
  param
    group_id
    group_name
    chat_type
    permission
**************************************** */
function groupClick(group_id, group_name, chat_type, permission) {
  nowChatClick();
  setChat(group_id, group_name, chat_type, permission);
}

/* ****************************************
 add Group Click
**************************************** */
function addGroupClick() {
  $("#createGroupName").val("");
  $(".main").hide();
  $("#group-create-main").show();
}

/* ****************************************
 delete Group Click
**************************************** */
function deleteGroupClick() {
  deleteGroup();
}