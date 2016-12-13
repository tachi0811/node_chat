// ******************************
// jquery windows.ready と同じ
// ******************************
$(function(){
  $("#loginform").validationEngine();
  $("#createform").validationEngine();

  // ******************************
  // create button click
  // ******************************
  $("#createUser").click(function(e) {

    $("#creatediv").dialog({
      modal: true,
      width: 500,
      dialogClass: 'noTitle'
    });

  });

  // ******************************
  // cancel button click
  // ******************************
  $("#cancel").click(function(e) {
    $("#creatediv").dialog('close');
  });

  // ******************************
  // create button click
  // ******************************
  $("#create").click(function(e) {

    if (!$("#createform").validationEngine('validate')) {
      return false;
    }

    var sendData = {
      "email" : $("#cre_email").val(),
      "name" : $("#cre_name").val(),
      "password" : $("#cre_password").val()
    };
    $.ajax({
      type: "POST",
      data: sendData,
      dataType: "JSON",
      charset: "UTF-8",
      url: "/login/createUser",
      // timeout: 3000,
    // ===============
    // 通信成功
    // ===============
    }).done(function(res, status, xhr) {
      if (res.result == "0") {
        $("#messageDialog span").text("登録しました");
        $("#messageDialog").dialog({
          title: "Success",
          modal: true,
          close: function() {
            $("#createform .input").val("");
            $("#creatediv").dialog('close');
          }
        });
      } else if (res.result == "1") {
        $("#messageDialog span").text(res.message);
        $("#messageDialog").dialog({
          title: "Error",
          modal: true
        });
      }
    // ===============
    // 通信失敗
    // ===============
    }).fail(function(xhr, status, thrown) {
      $("#messageDialog span").text("error");
      $("#messageDialog").dialog({
        title: "メッセージ",
        modal: true
      });
    // ===============
    // その他
    // ===============
    }).always(function(xhr, status){
      
      hideLoading();
    });

  });

  // ******************************
  // login button click
  // ******************************
  $("#login").click(function(e){
    
    // jquery.ValidationEngin
    if (!$("#loginform").validationEngine('validate')) {
      return false;
    }

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
      // timeout: 3000,
    // ===============
    // 通信成功
    // ===============
    }).done(function(res, status, xhr) {
      $("#messageDialog span").text("success");
      $("#messageDialog").dialog({
        title: "メッセージ",
        modal: true
      });
    // ===============
    // 通信失敗
    // ===============
    }).fail(function(xhr, status, thrown) {
      $("#messageDialog span").text("error");
      $("#messageDialog").dialog({
        title: "メッセージ",
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
