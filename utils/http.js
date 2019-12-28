const app = getApp()
const {
  serverUrl
} = app;
const user = app.getGlobalUserInfo()
class HTTP {
  get(url,data) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data,'GET')
    })
  }
  post(url,data) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data,'POST')
    })
  }
  _request(itemUrl, resolve, reject, data, method) {
    wx.showLoading()
    wx.request({
      url: serverUrl + itemUrl,
      data,
      method,
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': user.id,
        'headerUserToken': user.userToken
      },
      success: (res) => {
        // 判断以2（2xx)开头的状态码为正确
        // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
        const {
          statusCode
        } = res
        if (statusCode == 200) {
          wx.hideLoading()
          resolve(res.data)
        } else if (res.status == 502) {
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
          reject()
        }
      },
      fail: err => {
        reject()
      }
    })
  }

}
export {HTTP}