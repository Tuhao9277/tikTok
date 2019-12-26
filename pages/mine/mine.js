const app = getApp()
const serverUrl = app.serverUrl;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    faceUrl: "../resource/images/noneface.png",
    isMe: true
  },
  onLoad: function() {
    var user = app.userInfo
    wx.showLoading({
      title: '请等待...',
    })
    wx.request({
      url: serverUrl + '/user/query?userId=' + user.id,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': app.userInfo.id,
        'headerUserToken': app.userInfo.userToken
      },
      success: (res) => {
        wx.hideLoading()
        const {
          status
        } = res.data
        if (status === 200) {
          let userInfo = res.data.data
          let faceUrl = userInfo.faceImage ? serverUrl + userInfo.faceImage : "../resource/images/noneface.png"
          const {
            fansCounts,
            followCounts,
            receiveLikeCounts
          } = userInfo
            this.setData({
              faceUrl,
              fansCounts,
              followCounts,
              receiveLikeCounts
            })
        }
      }
    })
  },

  logout: () => {
    var user = app.userInfo
    wx.showLoading({
      title: '请等待...',
    })
    wx.request({
      url: serverUrl + '/logout?userId=' + user.id,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        wx.hideLoading()
        let status = res.data.status
        if (status === 200) {
          wx.showToast({
              title: '注销成功!',
              icon: 'none',
              duration: 3000
            }),
            app.userInfo = null
          // TODO 跳转到登录页面
          wx.navigateTo({
            url: '../userLogin/login',
          })
        } else if (status === 500) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },
  changeFace: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        wx.showLoading({
          title: '上传中...',
        })
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + app.userInfo.id, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          header: {
            'content-type': 'application/json', // 默认值
            'headerUserId': app.userInfo.id,
            'headerUserToken': app.userInfo.userToken
          },
          name: 'file',
          success: (res) => {
            wx.hideLoading()
            const data = JSON.parse(res.data)
            if (data.status === 200) {
              wx.showToast({
                title: '上传成功',
                icon: 'success'
              })
              let faceUrl = serverUrl + data.data
              this.setData({
                faceUrl
              })


            } else if (data.status === 500) {
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000
              })
            } else if (data.status === 502) {
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000
              })
              wx.navigateTo({
                url: '../userLogin/login',
              })
            }
          }
        })
      }
    })
  },
  uploadVideo:function(){
    wx.chooseVideo({
      sourceType: ['album','camera'],
      success: (res)=> {
        const {
          duration,
          width,
          height,
          tmpVideoUrl,
          tmpCoverUrl
        } = res
      if(duration > 10){
        wx.showToast({
          title: '视频长度不能超过10秒..',
          icon:'none'
        })
      }
       else if (duration < 5) {
          wx.showToast({
            title: '视频长度不能小于5秒..',
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }

})