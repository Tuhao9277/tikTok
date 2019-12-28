import {
  HTTP
} from './http.js'
class Api extends HTTP {

  getBgmList() {
    return this.post('/bgm/list')
  } // 获取bgm列表

  login(params) {
    return this.post('/login', params)
  } // 登录接口

  getUserInfo(id) {
    return this.post(`/user/query?userId=${id}`, )
  } // 获取用户信息
  getUserFans(userId, fanId) {
    return this.post(`/user/query?userId=${userId}&fanId=${fanId}`, )
  }
  // 注销接口
  logout(id) {
    return this.post(`/logout?userId=${id}`)
  }
  // 获取视频列表
  getVideoList(page, userId) {
    return this.post(`/video/showAll?page=${page}&pageSize=6`, {
      userId
    })
  }
  // 获取点赞视频列表
  getLikeList(page, userId) {
    return this.post(`/video/showMyLike?page=${page}&pageSize=6&userId=${userId}`)
  }
  // 获取关注列表
  getMyFollowList(page, userId) {
    return this.post(`/video/showMyFollow?page=${page}&pageSize=6&userId=${userId}`)
  }
  // 获取视频发布者信息
  getPublisherInfo(loginUserId, videoId, publisherId) {
    return this.post(`/user/queryPublisher?loginUserId=${loginUserId}&videoId=${videoId}&publishUserId=${publisherId}`)
  }
  // 获取视频评论信息
  getCommentList(page, userId) {
    return this.post(`/video/getVideoComments?page=${page}&pageSize=5&videoId=${videoId}`)
  }
}
const api = new Api()
export {
  api
}