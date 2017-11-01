
function getForgeToken(callback) {
  jQuery.ajax({
    url: '/viewer/user/token',
    success: function (res) {
      // console.log('res de token client', res);
      callback(res.access_token, res.expires_in)
    }
  });
}