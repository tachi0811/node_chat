// ******************************
// jquery windows.ready と同じ
// ******************************
$(function(){
  $("#loginform").validationEngine();

  // ******************************
  // login button click
  // ******************************
  $("#login").click(function(e){
    
    // jquery.ValidationEngin
    if (!$("#loginform").validationEngine('validate')) {
      return false;
    }

    showLoading();

    var sendData = {
      "email" : $("#email").val(),
      "password" : $("#password").val()
    };
    $.ajax({
      type: "GET",
      data: sendData,
      dataType: "JSON",
      charset: "UTF-8",
      contentType: "application/JSON",
      url: "/login/getUser",
      timeout: 3000,
    // ********************
    // 通信成功
    // ********************
    }).done(function(res, status, xhr) {
      
      $("#messageDialog span").text("success");
      $("#messageDialog").dialog({
        modal: true
      });
    // ********************
    // 通信失敗
    // ********************
    }).fail(function(xhr, status, thrown) {
      $("#messageDialog span").text("error");
      $("#messageDialog").dialog({
        modal: true
      });
    // ********************
    // その他
    // ********************
    }).always(function(xhr, status){
      hideLoading();
    });
  });
});
