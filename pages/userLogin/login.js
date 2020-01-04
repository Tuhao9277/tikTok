import {
  api
} from './../../utils/api.js'
const app = getApp()
Page({
  data: {},

  onLoad: function(params) {
    var me = this;
    var redirectUrl = params.redirectUrl;
    // debugger;
    if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
      redirectUrl = redirectUrl.replace(/#/g, "?");
      redirectUrl = redirectUrl.replace(/@/g, "=");

      me.redirectUrl = (decodeURIComponent(redirectUrl))
    }
  },

  // 登录  
  doLogin: function(e) {
    var me = this;
    var formObject = e.detail.value;
    const {
      username,
      password
    } = formObject
    // 简单验证
    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    } else {
      // 调用后端
      const params = {
        username,
        password
      }
      api.login(params)
      .then(res => {
        if (res) {
          wx.hideLoading();
          // 登录成功跳转 
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          });
          app.setGlobalUserInfo(res.data);
          // 页面跳转
          var redirectUrl = me.redirectUrl;
          if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
            wx.redirectTo({
              url: redirectUrl,
            })
          } else {
            wx.redirectTo({
              url: '../mine/mine',
            })
          }
        }
      })
    }
  },

  goRegistPage: function() {
    wx.redirectTo({
      url: '../userRegist/regist',
    })
  }
})