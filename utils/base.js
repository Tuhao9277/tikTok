const app = getApp()
const {
  serverUrl
} = app;
const user = app.getGlobalUserInfo();

const _get = (itemUrl, resolve, reject, data) => {
  
}

const _post = (itemUrl, resolve, reject, data) => {
  wx.showLoading({
    title: '请等待...',
  })
  return wx.request({
    url: serverUrl + itemUrl,
    data,
    method: 'POST',
    header: {
      'content-type': 'application/json', // 默认值
      'headerUserId': user.id,
      'headerUserToken': user.userToken
    },
    success: function(res) {
      // 判断以2（2xx)开头的状态码为正确
      // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
      const {
        status
      } = res
      if (status == 200) {
        wx.hideLoading()
        resolve(res.data) 
      } else if (res.data.status == 502) {
        wx.showToast({
          title: res.data.msg,
          duration: 2000,
          icon: "none",
          success: function() {
            wx.redirectTo({
              url: '../userLogin/login',
            })
          }
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 2000,
          icon: "none",
        });
      }
    },
    fail:err=>{
      reject() 
    }
  });
}
export const get = (url, data) => {
  return new Promise((res, rej, data) => {
    _get(url, res, rej, data)
  })
}
export const post = (url, data) => {
  return new Promise((res, rej, data) => {
    _post(url, res, rej, data)
  })
}
// function _refetch(param) {
//   var token = new Token();
//   token.getTokenFromServer((token) => {
//     this.request(param, true);
//   });
// }