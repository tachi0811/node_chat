function createSideBar(data) {

  var dataLength = data.length;
  var targetSideBar = $("#groupListItems");
  for (i = 0; i < dataLength; i++) {
    var d = data[i];
    var div = $("<div gid='" + d["id"] + "' class='groupItem'>");
    var li = $("<li class=''>");
    var div_nm = $("<div class='group_name'>").append($("<p>").text(d["group_name"]));

    li.append(div_nm);
    div.append(li);
    targetSideBar.append(div);

  }
}