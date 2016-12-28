// ******************************
// jquery windows.ready と同じ
// ******************************
$(function(){

    // Shift + Enterで送信
    $("#chatText").keydown(function(e) {
        if (e.shiftKey) {
            if (e.keyCode == 13) {
                console.log('Enterを押しました');
                $('#send').click();
                $("#chatText").val('');
                return false;
            }
        }
    });

});
