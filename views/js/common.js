function showLoading() {
  $("#loader").show();
  $("#loader_animation").show();
}
function hideLoading () {
  $("#loader").hide();
  $("#loader_animation").hide();
}

// jQueryに静的メソッドを追加
$.extend({

  // sprintfメソッドの定義
  sprintf: function(format) {

    // 第2引数以降を順に処理
    for (var i = 1; i < arguments.length; i++) {

      // 正規表現でプレイスホルダと対応する引数の値を置換処理
      var reg = new RegExp('\\{' + (i - 1) + '\\}', 'g');
      format = format.replace(reg, arguments[i]);
    }

    // 最終的な置き換え結果を戻り値として返す
    return format;
  }
});