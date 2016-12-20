// ******************************
// jquery windows.ready と同じ
// ******************************
$(function(){
  $("#loginform").validationEngine();
  $("#createform").validationEngine();

  // ******************************
  // create button click
  // ******************************
  $("#createAccount").click(function(e) {

    $("#logindiv").hide();
    $("#creatediv").show();

  });

  // ******************************
  // cancel button click
  // ******************************
  $("#cancel").click(function(e) {
    clickCancel(e);
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
      url: "/login/createAccount",
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
            clickCancel(null);
          }
        });
      } else if (res.result == "1") {
        $("#messageDialog span").text(res.message);
        $("#messageDialog").dialog({
          title: "Error",
          modal: true,
          close: function() {
            // 処理なし(処理がある時のために敢えて記述する)
          }
        });
      }
    // ===============
    // 通信失敗
    // ===============
    }).fail(function(xhr, status, thrown) {
      $("#messageDialog span").text("error");
      $("#messageDialog").dialog({
        title: "メッセージ",
        modal: true,
        close: function() {
          // 処理なし(処理がある時のために敢えて記述する)
        }
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
      type: "POST",
      data: sendData,
      dataType: "JSON",
      charset: "UTF-8",
      // contentType: "application/JSON",
      url: "/login/",
      // timeout: 3000,
    // ===============
    // 通信成功
    // ===============
    }).done(function(res, status, xhr) {
      if (res.result == "0") {
        // main 画面へ
        window.location.href = "./main.html";
      } else {
        $("#messageDialog span").text(res.message);
        $("#messageDialog").dialog({
          title: "Success",
          modal: true,
          close: function() {
            // 処理なし(処理がある時のために敢えて記述する)
          }
        });
      }
      
    // ===============
    // 通信失敗
    // ===============
    }).fail(function(xhr, status, thrown) {
      $("#messageDialog span").text("error");
      $("#messageDialog").dialog({
        title: "Error",
        modal: true,
        close: function() {
          /// 処理なし(処理がある時のために敢えて記述する)
        }
      });
    // ********************
    // その他
    // ********************
    }).always(function(xhr, status){
      hideLoading();
    });
  });
});

function clickCancel(e) {
  $("#createform .input").val("");
  $("#logindiv").show();
  $("#creatediv").hide();
  $("#createform").validationEngine('hide')
}