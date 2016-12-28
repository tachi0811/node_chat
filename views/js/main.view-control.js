// ******************************
// jquery windows.ready と同じ
// ******************************
$(function(){

  // Shift + Enterで送信
  $("#chatText").keydown(function(e) {
    if (e.shiftKey) {
      if (e.keyCode == 13) {
        $('#send').click();
        $("#chatText").val('');
        return false;
      }
    }
  });

});
