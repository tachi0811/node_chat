// ******************************
// jquery windows.ready と同じ
// ******************************
var sio;              // socket.io

$(function(){

  // --------------------
  // socket.io 
  // --------------------
  sio = io.connect()

  sio.on('connect', function() {
    console.log("connected");
  });



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
        // main 画面へ
        window.location.href = "./main.html";
      } else if (res.result == "1") {
        showDialog('Error', res.message)
      }
      // ===============
      // 通信失敗
      // ===============
    }).fail(function(xhr, status, thrown) {
      // TODO:暫定でメッセージをxhr.messageとする
      showDialog('Error', xhr.message)
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
        if (res.is_diff_user) {
          sio.emit("send_login", { "before_user_id": res.before_user_id } );
        }
        window.location.href = "./main.html";

      } else {
        showDialog('Success', res.message);
      }
      // ===============
      // 通信失敗
      // ===============
    }).fail(function(xhr, status, thrown) {
        showDialog('Error', res.message);
      // ********************
      // その他
      // ********************
    }).always(function(xhr, status){
      hideLoading();
    });
  });
});

// ******************************
// キャンセルボタンクリック
// ******************************
function clickCancel(e) {
  $("#createform .input").val("");
  $("#logindiv").show();
  $("#creatediv").hide();
  $("#createform").validationEngine('hide')
}