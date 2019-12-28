const app = getApp()
import {
  api
} from './../../utils/api'
const userInfo = app.getGlobalUserInfo();
const {
  serverUrl
} = app
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgmList: [],
    serverUrl: "",
    videoParams: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    var me = this
    me.setData({
      videoParams: params
    })
    api.getBgmList().then(res => {
      me.setData({
        bgmList: res.data,
        serverUrl
      })
    })

  },
  upload: function(e) {
    var me = this
    const {
      bgmId,
      desc
    } = e.detail.value
    const {
      duration,
      tmpHeight,
      tmpWidth,
      tmpVideoUrl,
    } = me.data.videoParams
    // 上传短视频
    wx.showLoading({
      title: '上传中...',
    })

    wx.uploadFile({
      url: serverUrl + '/video/upload',
      formData: {
        userId: userInfo.id,    // fixme 原来的 app.userInfo.id
        bgmId,
        desc,
        videoSeconds: duration,
        videoHeight: tmpHeight,
        videoWidth: tmpWidth
      },
      filePath: tmpVideoUrl,
      name: 'file',
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': userInfo.id,
        'headerUserToken': userInfo.userToken
      },
      success: function (res) {
        const data = JSON.parse(res.data);
        wx.hideLoading();
        if (data.status == 200) {
          wx.showToast({
            title: '上传成功!~~',
            icon: "success"
          });
          // 上传成功后跳回之前的页面
          wx.navigateBack({
            delta: 1
          })

        } else if (res.data.status == 502) {
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: "none"
          });
          wx.redirectTo({
            url: '../userLogin/login',
          })
        } else {
          wx.showToast({
            title: '上传失败!~~',
            icon: "success"
          });
        }

      }
    })



  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(e) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})