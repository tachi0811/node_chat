/* ****************************************
  chat change
**************************************** */
function groupClick(group_id, group_name) {
  setChat(group_id, group_name);
}

/* ****************************************
 groups tag create
**************************************** */
function createGroup(data) {

  var dataLength = data.length;
  $("#groupListItems").empty();

  for (i = 0; i < dataLength; i++) {
    var d = data[i];
    var groupText = "<li><a herf='#' gid='{0}' class=\"nav-action\" onclick=\"groupClick('{0}', '{1}')\" class='groupItem'>{1}</a></li>";
    groupText = $.sprintf(groupText, d["id"], d["group_name"]);
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