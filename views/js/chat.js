function createChat(data) {

  var dataLength = data.length;
  var targetSideBar = $("#groupListItems");
  for (i = 0; i < dataLength; i++) {
    var d = data[i];
    // var div = $("<div gid='" + d["id"] + "' class='groupItem'>");
    var li = $("<li>");
    var div_nm = $("<a herf='#' gid='" + d["id"] + "' class='groupItem'>").text(d["group_name"]);
    li.append(div_nm);
    targetSideBar.append(li);

  }
}