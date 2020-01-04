const app = getApp()
const {
  serverUrl,
  reportReasonArray
} = app
import {
  api
} from './../../utils/api'
const user = app.getGlobalUserInfo();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasonType: '请选择原因',
    reportReasonArray,
    publishUserId: '',
    videoId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    const {
      videoId,
      publishUserId
    } = params
    this.setData({
      publishUserId,
      videoId
    })
  },
  changeMe: function(e) {
    const index = e.detail.value
    const reasonType = this.data.reportReasonArray[index]
    this.setData({
      reasonType
    })
  },
  submitReport: function(e) {
    const {
      reasonIndex,
      reasonContent
    } = e.detail.value
    if (reasonIndex === null || reasonIndex === '' || reasonIndex === undefined) {
      wx.showToast({
        title: '请选择举报理由',
        icon: 'none'
      })
      return
    }
    if (!reasonContent) {
      wx.showToast({
        title: '请填写举报原因',
        icon: 'none'
      })
      return

    }
    const {
      publishUserId,
      videoId,
      reasonType,
      reportReasonArray,
    } = this.data
    const userid = user.id
    const params = {
      dealUserId: publishUserId,
      dealVideoId: videoId,
      title: reasonType,
      content: reasonContent,
      userid
    }
    api.reportUser(params).then(res => {
      wx.showToast({
        title: '举报成功！',
        icon: 'success',
        duration: 2000,
        success: function() {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      })

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

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