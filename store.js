import Vue from 'vue'
import Vuex from 'vuex'
import {
  queryArchivesCount,
  queryFilterArchivesCount,
  queryInspirationCount,
  queryPosts,
  queryPost,
  queryTag,
  queryCategory,
  queryInspiration,
  queryPage,
  queryHot,
  increaseHot,
  queryLike,
  visitorStatistics,
} from './utils/services'
import { formatPost, formatCategory, formatInspiration, formatPage } from './utils/format'

Vue.use(Vuex)

let tipsTimer = ''

export default new Vuex.Store({
  state: {
    tips: '',
    tipsUpdateAt: '',
    totalCount: 0,
  },
  mutations: {
    // 设置一言
    setTips(state, { tips }) {
      state.tips = tips
      state.tipsUpdateAt = new Date()
    },
    // 设置文章总数
    setTotalCount(state, { totalCount }) {
      state.totalCount = totalCount
    },
  },
  actions: {
    // 显示一言
    async showTips({ commit }, { tips }) {
      clearTimeout(tipsTimer)
      commit('setTips', { tips })
      tipsTimer = setTimeout(() => {
        commit('setTips', { tips: '' })
      }, 6000)
    },
    // 获取文章总数
    async queryArchivesCount({ commit }) {
      const data = await queryArchivesCount()
      const totalCount = data.repository.issues.totalCount
      commit('setTotalCount', { totalCount })
    },
    // 获取分类 & 标签筛选文章数量
    async queryFilterArchivesCount(context, payload) {
      const data = await queryFilterArchivesCount(payload)
      return data.search.issueCount
    },
    // 获取灵感总数
    async queryInspirationCount() {
      const data = await queryInspirationCount()
      return data.repository.issues.totalCount
    },
    // 获取归档
    async queryPosts(context, payload) {
      let data = await queryPosts(payload)
      data.forEach(formatPost)
      return data
    },
    // 获取文章热度
    async queryHot(context, { ids }) {
      return await queryHot(ids)
    },
    // 增加文章热度
    async increaseHot(context, { post }) {
      return await increaseHot(post)
    },
    // 获取文章详情
    async queryPost(context, { number }) {
      let post = await queryPost(number)
      return formatPost(post)
    },
    // 获取分类
    async queryCategory() {
      let data = await queryCategory()
      return formatCategory(data)
    },
    // 获取标签
    async queryTag() {
      let data = await queryTag()
      const filterLabel = ['Inspiration', 'Friend', 'Book', 'About']
      return data.filter((o) => !filterLabel.includes(o.name))
    },
    // 获取灵感
    async queryInspiration(context, { page, pageSize }) {
      let data = await queryInspiration({ page, pageSize })
      return formatInspiration(data)
    },
    // 获取书单 & 友链 & 关于
    async queryPage(context, { type }) {
      let data = await queryPage(type)
      return formatPage(data, type)
    },
    // 获取点赞数
    async queryLike(context, payload) {
      return await queryLike(payload)
    },
    // 统计访问来源
    async visitorStatistics(context, payload) {
      await visitorStatistics(payload)
    },
  },
})
