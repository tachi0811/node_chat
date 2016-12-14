// ******************************
// jquery windows.ready と同じ
// ******************************
$(function(){
var sendData = { "user_id" : 1 };
  $.ajax({
    type: "GET",
    data: sendData,
    dataType: "JSON",
    charset: "UTF-8",
    contentType: "application/JSON",
    url: "/main/groups",
    // timeout: 3000,
  // ===============
  // 通信成功
  // ===============
  }).done(function(res, status, xhr) {
    if (res.result == "0") {
      createSideBar(JSON.parse(res.data));
    } else if (res.result == "1") {
      

    }
  // ===============
  // 通信失敗
  // ===============
  }).fail(function(xhr, status, thrown) {
    
      
  // ===============
  // その他
  // ===============
  }).always(function(xhr, status){
    hideLoading();
  });
});

// 
// window load
// 
$(window).load(function(e) {
  showLoding();
  
});
