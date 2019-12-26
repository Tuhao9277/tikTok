const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  doRegist:function(e) {
    var formObject = e.detail.value
    var username = formObject.username
    var password = formObject.password
    // 简单验证
    if(username.length === 0 || password.length === 0){
      wx.showToast({
        title: '用户名或密码不能为空',
        icon:'none',
        duration:3000
      })
    }else{
      var serverUrl = app.serverUrl
      wx.request({
        url: serverUrl+ '/regist',
        method:'POST',
        header:{
          'content-type': 'application/json' // 默认值
        },
        data:{
          username,
          password
        },
        success:function(res){
          let status = res.data.status
          if(status === 200){
            wx.showToast({
              title: '用户注册成功!',
              icon: 'none',
              duration: 3000
            }),
              app.userInfo = res.data.data
          }else if(status === 500){
            wx.showToast({
              title: res.data.msg,
              icon:'none',
              duration:3000
            })
          }
        }
      })
    }
  },
  goLoginPage:()=>{
    wx.navigateTo({
      url:'../userLogin/login'
    })
  }


})