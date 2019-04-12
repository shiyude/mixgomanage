import Vue from 'vue'
import Router from 'vue-router'
import {
  Notification
} from 'element-ui'

Vue.use(Router)

const router = new Router({
  // mode: 'history',  
  routes: [

    {
      path: '/home',
      name: 'home',
      component: resolve => {
        require(['@/views/home.vue'], resolve)
      },
      redirect: {
        path: '/home/appHomeModule.html'
      },

      children: [{

          path: 'appHomeModule.html', //APP管理首页
          name: 'appHomeModule',
          component: () =>
            import('@/views/appManage/appManageIndex/appHomeModule.vue')
        },
        {
          path: 'changePassword.html', //APP管理首页 - 轮播管理
          name: 'changePassword',
          component: () =>
            import('@/views/userControl/changePassword.vue')
        },
        {
          path: 'AppCarousel.html', //APP管理首页 - 轮播管理
          name: 'AppCarousel',
          component: () =>
            import('@/views/appManage/appManageIndex/appHomeModule-carousel.vue')
        },
        {
          path: 'AppMainIcon.html', //APP管理首页 - 主标管理
          name: 'AppMainIcon',
          component: () =>
            import('@/views/appManage/appManageIndex/appHomeModule-mainIcon.vue')
        },
        {
          path: 'AppStore.html', //APP管理首页 - 门店管理
          name: 'AppStore',
          component: () =>
            import('@/views/appManage/appManageIndex/appHomeModule-store.vue')
        },
        {
          path: 'AppNewlyElected.html', //APP管理首页 - 今日新选
          name: 'AppNewlyElected',
          component: () =>
            import('@/views/appManage/appManageIndex/appHomeModule-newlyElected.vue')
        },
        {
          path: 'AppMatch.html', // APP管理首页 - 全景搭配
          name: 'AppMatch',
          component: () =>
            import('@/views/appManage/appManageIndex/appHomeModule-match.vue')
        },
        {
          path: 'AppThings.html', //APP管理首页 - 特卖好物
          name: 'AppThings',
          component: () =>
            import('@/views/appManage/appManageIndex/appHomeModule-Things.vue')
        },
        {
          path: 'AppGrouping.html', //APP管理首页 - 推荐分组
          name: 'AppGrouping',
          component: () =>
            import('@/views/appManage/appManageIndex/appHomeModule-Grouping.vue')
        },
        {
          path: 'appGroupGoodsList.html', //APP管理首页 - 推荐分组
          name: 'appGroupGoodsList',
          component: () =>
            import('@/views/appManage/appManageIndex/appGroupGoodsList.vue')
        },
        {
          path: 'appManageFind.html', //APP管理发现
          name: 'appManageFind',
          component: () =>
            import('@/views/appManage/appManageFind/appManageFind.vue')
        },
        {
          path: 'FindCreation.html', //APP管理发现-创建
          name: 'FindCreation',
          component: () =>
            import('@/views/appManage/appManageFind/FindCreation.vue')
        },
        {
          path: 'findManageGoods.html', //APP管理发现-发现的品牌管理
          name: 'findManageGoods',
          component: () =>
            import('@/views/appManage/appManageFind/findManageGoods.vue')
        },
        {
          path: 'appCategory.html', //APP管理分类-类目
          name: 'appCategory',
          component: () =>
            import('@/views/appManage/appClassify/appCategory/appCategory.vue')
        },
        {
          path: 'addFurniture.html', //APP管理分类-添加家具
          name: 'addFurniture',
          component: () =>
            import('@/views/appManage/appClassify/appCategory/addFurniture.vue')
        },
        {
          path: 'appSeries.html', //APP管理分类-系列
          name: 'appSeries',
          component: () =>
            import('@/views/appManage/appClassify/appSeries/appSeries.vue')
        },
        {
          path: 'appChildrenSeries.html', //APP管理分类-子系列
          name: 'appChildrenSeries',
          component: () =>
            import('@/views/appManage/appClassify/appSeries/appChildrenSeries.vue')
        },
        {
          path: 'childrenSeriesAddGoods.html', //APP管理分类-子系列添加商品
          name: 'childrenSeriesAddGoods',
          component: () =>
            import('@/views/appManage/appClassify/appSeries/childrenSeriesAddGoods.vue')
        },
        {
          path: 'goodsRecommend.html', //APP管理我的-精品推荐
          name: 'goodsRecommend',
          component: () =>
            import('@/views/appManage/appMe/goodsRecommend.vue')
        },
        {
          path: 'needHelp.html', //APP管理我的-needHelp
          name: 'needHelp',
          component: () =>
            import('@/views/appManage/appMe/needHelp.vue')
        },
        {
          path: 'faq.html', //APP管理我的-faq
          name: 'faq',
          component: () =>
            import('@/views/appManage/appMe/faq.vue')
        },
        {
          path: 'privacyPolicy.html', //APP管理我的-privacyPolicy
          name: 'privacyPolicy',
          component: () =>
            import('@/views/appManage/appMe/privacyPolicy.vue')
        },
        // {
        //   path: 'needHelp.html', //APP管理我的-needHelp
        //   name: 'needHelp',
        //   component: () =>
        //     import('@/views/appManage/appMe/needHelp.vue')
        // },
        {
          path: 'bootPage.html', //APP管理我的-精品推荐
          name: 'bootPage',
          component: () =>
            import('@/views/appManage/appBootPage/bootPage.vue')
        },
        {
          path: 'newsManage.html', //PC管理-新闻管理
          name: 'newsManage',
          component: () =>
            import('@/views/pcManage/newsManage.vue')
        },
        {
          path: 'news.html', //PC管理-新闻列表
          name: 'news',
          component: () =>
            import('@/views/pcManage/news.vue')
        },
        {
          path: 'furniture.html', //商品管理-发布商品
          name: 'furniture',
          component: () =>
            import('@/views/goodsManage/furniture/furniture.vue')
        },
        {
          path: 'goodsList.html', //商品管理-商品列表
          name: 'goodsList',
          component: () =>
            import('@/views/goodsManage/furniture/goodsList.vue')
        },
        {
          path: 'unclassifiedList.html', //商品管理-未分类商品列表
          name: 'unclassifiedList',
          component: () =>
            import('@/views/goodsManage/unclassified/unclassifiedList.vue')
        },
        {
          path: 'GoodsAuditList.html', //商品管理-审核列表
          name: 'GoodsAuditList',
          component: () =>
            import('@/views/goodsManage/GoodsAuditList.vue')
        },
        {
          path: 'GoodsIssueList.html', //商品管理-发布列表
          name: 'GoodsIssueList',
          component: () =>
            import('@/views/goodsManage/GoodsIssueList.vue')
        },
        {
          path: 'housesList.html', //户型管理-户型列表
          name: 'housesList',
          component: () =>
            import('@/views/houseManage/house/housesList.vue')
        },
        {
          path: 'house.html', //户型管理-发布户型
          name: 'house',
          component: () =>
            import('@/views/houseManage/house/houseType.vue')
        },
        {
          path: 'houseRoom.html', //户型管理-房型列表
          name: 'houseRoom',
          component: () =>
            import('@/views/houseManage/room/houseRoom.vue')
        },
        {
          path: 'houseStyle.html', //户型管理-风格列表
          name: 'houseStyle',
          component: () =>
            import('@/views/houseManage/style/houseStyle.vue')
        },
        {
          path: 'manufacturers.html', //商家管理-厂家管理
          name: 'manufacturers',
          component: () =>
            import('@/views/merchantManage/manufacturers.vue')
        },
        {
          path: 'mansion.html', //商家管理-楼盘管理
          name: 'mansion',
          component: () =>
            import('@/views/merchantManage/mansion/mansion.vue')
        },
        {
          path: 'houseType.html', //商家管理-楼盘管理
          name: 'houseType',
          component: () =>
            import('@/views/merchantManage/mansion/houseType.vue')
        },
        {
          path: 'estate.html', //商家管理-开发商
          name: 'estate',
          component: () =>
            import('@/views/merchantManage/developers/estate.vue')
        },
        {
          path: 'developerRelateHouse.html', //商家管理-开发商-开发商关联楼盘
          name: 'developerRelateHouse',
          component: () =>
            import('@/views/merchantManage/developers/developerRelateHouse.vue')
        },
        {
          path: 'agentRegulate.html', //商家管理-代理商
          name: 'agentRegulate',
          component: () =>
            import('@/views/merchantManage/agent/agentRegulate.vue')
        },
        {
          path: 'agentRelateBrand.html', //商家管理-代理商-品牌管理
          name: 'agentRelateBrand',
          component: () =>
            import('@/views/merchantManage/agent/agentRelateBrand.vue')
        },
        {
          path: 'agentRelateShop.html', //商家管理-代理商-门店管理
          name: 'agentRelateShop',
          component: () =>
            import('@/views/merchantManage/agent/agentRelateShop.vue')
        },
        {
          path: 'shopRegulate.html', //商家管理-门店
          name: 'shopRegulate',
          component: () =>
            import('@/views/merchantManage/shop/shopRegulate.vue')
        },
        {
          path: 'shopClassify.html', //商家管理-门店-门店分类
          name: 'shopClassify',
          component: () =>
            import('@/views/merchantManage/shop/shopClassify.vue')
        },
        {
          path: 'shopGoods.html', //商家管理-门店-门店分类商品
          name: 'shopGoods',
          component: () =>
            import('@/views/merchantManage/shop/shopGoods.vue')
        },
        {
          path: 'brandList.html', //品牌管理-品牌列表
          name: 'brandList',
          component: () =>
            import('@/views/brandManage/brandList.vue')
        },
        {
          path: 'brandGroup.html', //品牌管理-品牌分组
          name: 'brandGroup',
          component: () =>
            import('@/views/brandManage/brandGroup.vue')
        },
        {
          path: 'addBrand.html', //品牌管理-添加品牌
          name: 'addBrand',
          component: () =>
            import('@/views/brandManage/addBrand.vue')
        },
        {
          path: 'brandGoods.html', //品牌管理-品牌门店
          name: 'brandGoods',
          component: () =>
            import('@/views/brandManage/brandGoods.vue')
        },
        {
          path: 'brandClassify.html', //品牌管理-品牌分类
          name: 'brandClassify',
          component: () =>
            import('@/views/brandManage/brandClassify.vue')
        },
        {
          path: 'brandclassifyGoods.html', //品牌管理-品牌分类- 分类商品
          name: 'brandclassifyGoods',
          component: () =>
            import('@/views/brandManage/brandclassifyGoods.vue')
        },
        {
          path: 'navSet.html', //导航管理
          name: 'navSet',
          component: () =>
            import('@/views/navManage/navSet.vue')
        },
        {
          path: 'userList.html', //用户管理-用户列表
          name: 'userList',
          component: () =>
            import('@/views/userControl/userList.vue')
        },
        {
          path: 'itemCategoryList.html', //商品类型管理 - 商品类型列表
          name: 'itemCategory',
          component: () =>
            import('@/views/itemCategory/itemCategoryList.vue')
        },
        {
          path: 'categoryList.html', //商品类型管理 - 类型商品列表
          name: 'categoryList',
          component: () =>
            import('@/views/itemCategory/categoryList.vue')
        },
        {
          path: 'customUserList.html', // 定制客户管理 
          name: 'customUserList',
          component: () =>
            import('@/views/CustomUser/customUserList.vue')
        },
        {
          path: 'versionList.html', // 版本列表
          name: 'versionList',
          component: () =>
            import('@/views/versionManage/versionList.vue')
        },
        {
          path: 'editVersion.html', // 版本编辑
          name: 'editVersion',
          component: () =>
            import('@/views/versionManage/editVersion.vue')
        },
        {
          path: 'pictureUp.html', // 添加定制首页图片
          name: 'pictureUp',
          component: () =>
            import('@/views/appManage/pictureUp/pictureUp.vue')
        },
      ]
    },
    {
      path: '/',
      name: 'login',
      component: resolve => {
        require(['../views/login/login'], resolve)
      }
    }
  ]
})

// 路由跳转是判断用户是否登录
router.beforeEach((to, from, next) => {
  let userInfo = window.sessionStorage.getItem('userInfo')
  userInfo = userInfo ? JSON.parse(userInfo) : {}
  if (to.path !== '/' && (userInfo.userName === '' || userInfo.userName === undefined)) {
    const lang = sessionStorage.getItem("lang");
    if (!lang || lang === "zh-CN") {
      Notification({
        title: '警告',
        message: '账号未登录',
        type: 'warning'
      })
    } else {
      Notification({
        title: 'warning',
        message: 'Account not registered',
        type: 'warning'
      })
    }
    next('/')
  } else {
    next()
  }
  next()
})

export default router
