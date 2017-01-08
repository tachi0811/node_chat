/* ****************************************
 動的にDomを操作する場合のイベントを追加
**************************************** */
$(document).on("click", ".nav-action", (function(){
  $(".navbar-collapse").collapse('hide');
}));


/* ****************************************
 groups tag create
**************************************** */
function createSideBar(data) {

  var dataLength = data.length;
  var targetSideBar = $("#groupListItems");
  for (i = 0; i < dataLength; i++) {
    var d = data[i];
    var groupText = "<li><a herf='#' gid='{0}' class=\"nav-action\" onclick=\"groupClick('{0}', '{1}')\" class='groupItem'>{1}</a></li>";
    groupText = $.sprintf(groupText, d["id"], d["group_name"]);
    targetSideBar.append($(groupText));
  }
}

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