

/* ****************************************
 groups tag create
**************************************** */
function createSideBar(data) {

  var dataLength = data.length;
  var targetSideBar = $("#groupListItems");
  for (i = 0; i < dataLength; i++) {
    var d = data[i];
    var groupText = "<li><a herf='#' gid='{0}' onclick='groupClick('{0}')' class='groupItem'>{1}</a></li>";
    groupText = $.sprintf(groupText, d["id"], d["group_name"]);
    targetSideBar.append($(groupText));

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
      createSideBar(JSON.parse(res.data));
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