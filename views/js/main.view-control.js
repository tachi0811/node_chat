// ******************************
// jquery windows.ready と同じ
// ******************************
$(function(){

  
  $("#chatText").keydown(function(e) {

    // Shift + Enterで送信
    if (e.shiftKey) {
      if (e.keyCode == 13) {
        sendChat();
        return false;
      }
    }

    // Escapeでキャンセル
    else if (e.keyCode == 27) {
      clearChat();
      return false;
    }
  });

});
