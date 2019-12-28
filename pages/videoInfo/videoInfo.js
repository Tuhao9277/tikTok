const app = getApp()
const {
  serverUrl
} = app
import {
  api
} from './../../utils/api'
const user = app.getGlobalUserInfo();

// pages/videoInfo.js
Page({
  data: {
    src: '',
    cover: 'cover',
    videoId: '',
    videoInfo: {},
    serverUrl,
    userLikeVideo: false,

    commentsPage: 1,
    commentsTotalPage: 1,
    commentsList: [],

    placeholder:'说点什么....'
  },

  videoCtx: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    this.videoCtx = wx.createVideoContext('myVideo', this)
    const videoInfo = JSON.parse(decodeURIComponent(params.videoInfo))

    const {
      id,
      userId,
      videoWidth,
      videoHeight,
      videoPath
    } = videoInfo
    let cover = 'cover'
    if (videoWidth >= videoHeight) {
      cover = ''
    }
    this.setData({
      videoId: id,
      src: serverUrl  + videoPath,
      videoInfo,
      cover
    })
    let loginUserId
    if (user != null && user != undefined && user !== '') {
      loginUserId = user.id
    }
    api.getPublisherInfo(loginUserId, id, userId).then(res => {
      const {
        publisher,
        userLikeVideo
      } = res.data
      this.setData({
        publisher,
        userLikeVideo
      })
    })
    // this.getCommentsList(1)

  },
  getCommentsList: function(page) {
    const videoId = this.data.videoInfo.id
    api.getCommentList(page, videoId).then(res => {
      const {
        rows,
        total
      } = res.data
      let newCommentsList = this.data.commentsList
      this.setData({
        commentsList : newCommentsList.concat(commentsList),
        commentsPage:page,
        commentsTotalPage: total
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
    this.videoCtx.play()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.videoCtx.pause()
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