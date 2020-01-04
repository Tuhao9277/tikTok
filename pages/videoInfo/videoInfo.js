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

    placeholder: '说点什么....'
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
      src: serverUrl + videoPath,
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
    this.getCommentsList(1)

  },
  // 获取评论列表
  getCommentsList: function(page) {
    const videoId = this.data.videoInfo.id
    api.getCommentList(page, videoId).then(res => {
      const {
        rows,
        total
      } = res.data
      let newCommentsList = this.data.commentsList
      this.setData({
        commentsList: newCommentsList.concat(rows),
        commentsPage: page,
        commentsTotalPage: total
      })
    })
  },
  // 点赞or取消点赞
  likeVideoOrNot: function() {
    const {
      videoInfo
    } = this.data
    if (!user) {
      wx.navigateTo({
        url: '../userLogin/login',
      })
    } else {
      const userLikeVideo = this.data.userLikeVideo
      if (userLikeVideo) {
        api.setUnLike(user.id, videoInfo.id, videoInfo.userId).then(res => {
          this.setData({
            userLikeVideo: !userLikeVideo
          })
        })
      } else {
        api.setLike(user.id, videoInfo.id, videoInfo.userId).then(res => {
          this.setData({
            userLikeVideo: !userLikeVideo
          })
        })
      }
    }
  },
  // 分享功能
  shareMe: function() {
    const me = this
    wx.showActionSheet({
        itemList: ['下载到本地', '举报用户', '分享到朋友圈', '分享到QQ空间', '分享到微博'],
        success: (res) => {
          const {
            tapIndex
          } = res

          switch (tapIndex) {
            case 0:
              {
                this.downloadVideo()
                break;
              }
            case 1:
              {
                this.reportVideo()
                break;
              }
            default:
              {
                // 生成分享海报即可
                wx.showToast({
                  title: '暂未开放...',
                })
              }
          }
        }
      },

    )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // 下载视频
  downloadVideo: function() {
    wx.showLoading({
      title: '下载中...',
    })
    wx.downloadFile({
      url: serverUrl + this.data.videoInfo.videoPath,
      success: (res) => {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入success回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success: res => {
              wx.hideLoading()
              wx.showToast({
                title: '下载成功',
                icon: 'success',
              })
            }
          })
        }
      }
    })
  },
  // 举报视频
  reportVideo: function() {
    const {
      videoInfo
    } = this.data
    const realUrl = `../videoInfo/videoInfo#videoInfo@${videoInfo}`
    if (!user) {
      wx.navigateTo({
        url: `../userLogin/login?redirectUrl=${realUrl}`,
      })
    } else {
      const {
        userId,
        id
      } = videoInfo
      wx.navigateTo({
        url: `../report/report?videoId=${id}&publishUserId=${userId}`,
      })
    }
  },
  // 留言功能
  leaveComment: function(e) {
    this.setData({
      commentFocus: true
    })
  },
  replyFocus: function(e) {
    const {
      fathercommentId,
      touserid,
      tonickname
    } = e.currentTarget.dataset
    this.setData({
      placeholder: `回复:${tonickname}`,
      replyFatherCommentId: fatherCommentId,
      replyToUSerId: touserid,
      commentFocus: true
    })
  },
  saveComment: function(e) {
    const comment = e.detail.value
    const {
      videoInfo
    } = this.data
    const fatherCommentId = e.currentTarget.dataset.replyfathercommentid
    const toUserId = e.currentTarget.dataset.replytouserid

    const redirectVideoInfo = encodeURIComponent(JSON.stringify(videoInfo)) 
    const redirectUrl = `../videoInfo/videoInfo#videoInfo@${redirectVideoInfo}`
    if (!user) {
      wx.navigateTo({
        url: `../userLogin/login?redirectUrl=${redirectUrl}`,
      })
    } else {
      wx.showLoading({
        title: '请稍后...',
      })
      const params = {
        fromUserId: user.id,
        videoId: videoInfo.id,
        comment
      }
      api.saveComment(fatherCommentId, toUserId, params).then(res => {
        wx.hideLoading()
        this.setData({
          contentValue: '',
          commentsList: []
        })
        this.getCommentsList(1)
      })

    }

  },

  // 我的按钮
  showMine:function(e){
    if(!user){
      wx.navigateTo({
        url: '../userLogin/login',
      })
    }else{
      wx.switchTab({
        url: '../mine/mine',
      })
    }
  },
  // 回到首页
  showIndex:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
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
    const {
      commentsPage,
      commentsTotalPage
    } = this.data
    if (commentsPage === commentsTotalPage) {
      return
    }
    const page = commentsPage + 1
    this.getCommentsList(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    const {
      videoInfo
    } = this.data
    return {
      title: '短视频内容分析',
      path: `page/videoInfo/videoInfo?videoInfo=${JSON.stringify(videoInfo)}`
    }
  }
})