const app = getApp()
const {
  serverUrl
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
    faceUrl: "../resource/images/noneface.png",
    isMe: true,
    isFollow: false,
    serverUrl,
    videoSelClass: "video-info",
    isSelectedWork: "video-info-selected",
    isSelectedLike: "",
    isSelectedFollow: "",

    myVideoList: [],
    myVideoPage: 1,
    myVideoTotal: 1,

    likeVideoList: [],
    likeVideoPage: 1,
    likeVideoTotal: 1,

    followVideoList: [],
    followVideoPage: 1,
    followVideoTotal: 1,

    myWorkFalg: false,
    myLikesFalg: true,
    myFollowFalg: true
  },
  onLoad: function(params) {
    const me = this
    const {
      id
    } = user
    const {
      publisherId
    } = params
    let userId = id
    if (publisherId != null && publisherId != '' && publisherId != undefined) {
      userId = publisherId;
      me.setData({
        isMe: false,
        publisherId: publisherId,
        serverUrl: app.serverUrl
      })
    }
    this.setData({
      userId
    })
    api.getUserFans(userId, user.id).then(res => {
      let userInfo = res.data
      let faceUrl = userInfo.faceImage ? serverUrl + userInfo.faceImage : "../resource/images/noneface.png"
      const {
        fansCounts,
        followCounts,
        receiveLikeCounts,
        nickname,
        follow,
      } = userInfo
      this.setData({
        faceUrl,
        fansCounts,
        followCounts,
        receiveLikeCounts,
        nickname,
        isFollow: follow,
      })
      me.getMyVideoList(1)
    })
  },

  logout: () => {
    var user = app.userInfo
    app.logout(user.id).then(res => {
      if (res) {
        wx.showToast({
          title: '注销成功!',
          icon: 'none',
          duration: 3000
        })
        wx.navigateTo({
          url: '../userLogin/login',
        })
      }
    })
  },
  changeFace: () => {
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
  uploadVideo: () => {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      success: (res) => {
        const {
          duration,
          width,
          height,
          tempFilePath,
          thumbTempFilePath
        } = res
        if (duration > 10) {
          wx.showToast({
            title: '视频长度不能超过10秒..',
            icon: 'none'
          })
        } else if (duration < 5) {
          wx.showToast({
            title: '视频长度不能小于5秒..',
          })
        } else {
          wx.navigateTo({
            url: '../chooseBgm/chooseBgm?duration=' + duration +
              "&tmpHeight=" + height +
              "&tmpWidth=" + width +
              "&tmpVideoUrl=" + tempFilePath +
              "&tmpCoverUrl=" + thumbTempFilePath
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getMyVideoList: function(page) {
    const {
      id
    } = user
    api.getVideoList(page, id).then(res => {
      if (res) {
        const myVideoList = res.data.rows
        const newVideoList = this.data.myVideoList
        this.setData({
          myVideoPage: page,
          myVideoList: newVideoList.concat(myVideoList),
          myVideoTotal: res.data.total
        })
      }
    })
  },
  doSelectWork: function() {
    this.setData({
      isSelectedWork: "video-info-selected",
      isSelectedLike: "",
      isSelectedFollow: "",

      myWorkFalg: false,
      myLikesFalg: true,
      myFollowFalg: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    })
    this.getMyVideoList(1)
  },
  doSelectLike: function() {
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "video-info-selected",
      isSelectedFollow: "",

      myWorkFalg: true,
      myLikesFalg: false,
      myFollowFalg: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    })
    this.getMyLikesList(1)
  },
  doSelectFollow: function() {
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "",
      isSelectedFollow: "video-info-selected",

      myWorkFalg: true,
      myLikesFalg: true,
      myFollowFalg: false,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    })
    this.getMyFollowList(1)
  },
  getMyLikesList: function(page) {
    const {
      id
    } = user
    api.getLikeList(page, id).then(res => {
      const {
        rows,
        total
      } = res.data
      const newVideoList = this.data.likeVideoList
      this.setData({
        likeVideoPage: page,
        likeVideoList: newVideoList.concat(rows),
        likeVideoTotal: total
      })
    })
  },
  getMyFollowList: function(page) {
    const {
      id
    } = user
    api.getMyFollowList(page, id).then(res => {
      const {
        rows,
        total
      } = res.data
      const newVideoList = this.data.followVideoList
      this.setData({
        followVideoPage: page,
        followVideoList: newVideoList.concat(rows),
        followVideoTotal: total
      })
    })
  },
  showVideo: function(e) {
    const {
      myWorkFalg,
      myLikesFalg,
      myFollowFalg,
      myVideoList,
      likeVideoList,
      followVideoList
    } = this.data
    let videoList
    if (!myWorkFalg) {
       videoList = myVideoList
    } else if (!myLikesFalg) {
       videoList = likeVideoList
    } else if (!myFollowFalg) {
      videoList = followVideoList
    }
    const { arrindex } = e.target.dataset
    const videoInfo = JSON.stringify(videoList[arrindex])
    wx.redirectTo({
      url: '../videoInfo/videoInfo?videoInfo=' +encodeURIComponent(videoInfo),
    })
  },

})