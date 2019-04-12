import Vue from 'vue'

/* 接口地址 */
Vue.api = Vue.prototype.$api = {
  /**
   * 写入接口列表
   */
  uploader: '/uploader', // 上传图片
  newLogin: '/sysUser/login', // 登录
  deleteFile: '/deleteFile', // 删除图片
  queryCountrys: '/country/queryCountrys', // 选择国家
  queryUserCountrys: '/country/queryUserCountrys', // 查询所选国家

  /*PC管理-新闻管理*/
  newsList: '/news/queryNewsList', //新闻列表
  newsDetail: "/news/queryNewsById", //查询新闻详情
  saveNews: "/news/saveNews", //提交和保存新闻
  deleteNews: "/news/deleteNews", //删除新闻

  /* 用户管理 */
  querySysUsers: '/sysUser/querySysUsers', // 用户列表
  saveSysUser: '/sysUser/saveSysUser', // 设置导航权限
  queryCompanys: '/company/queryCompanys', // 查询定制用户
  updatePassword: "/sysUser/updatePassword", //更新密码

  /**导航管理 */
  loadUserMenu: '/sysUser/loadUserMenu', // 导航菜单
  navList: "/sysUser/loadMenuByUserId", //导航列表
  saveMenu: "/sysmenu/saveMenu", //保存菜单
  deleteMenu: "/sysmenu/deleteMenuById", //删除菜单
  saveSysUser: '/sysUser/saveSysUser', // 新增，保存
  deleteSysUser: '/sysUser/deleteSysUser', // 删除
  // queryCompanys:'/company/queryCompanys', // 选择定制客户
  loadMenuByUserId: '/sysUser/loadMenuByUserId', // 权限管理
  saveUserMenu: '/sysUser/saveUserMenu', // 分配菜单权限

  /**品牌管理 */
  saveBrand: "/brand/saveBrand", //保存品牌
  deleteBrand: "/brand/deleteBrandById", //删除品牌
  queryBrandList: "/brand/queryBrandList", //查询品牌列表
  queryBrandGroup: "/brandgroup/queryBrandGroups", //查询品牌分组
  saveGroup: "/brandgroup/saveBrandGroup", //保存分组
  deleteGroup: "/brandgroup/deleteBrandGroup", //删除分组
  saveBrandGroupJoin: "/brandgroup/saveBrandGroupJoin", //保存品牌和品牌分组关系
  queryBrandByGroupId: "/brand/queryBrandByGroupId", //查询分组下的品牌列表
  queryBrandNotExistsGroup: "/brand/queryBrandNotExistsGroup", //筛查出已选择的品牌
  deleteBrandGroupJoinByBrandId: "/brandgroup/deleteBrandGroupJoinByBrandId", //移除分组下的品牌
  setTop: "/brand/setTop", //品牌置顶
  setTopBrandGroup: "/brandgroup/setTopBrandGroup", //置顶品牌分组
  saveBrandCustomCategory: "/brandCustomCategory/saveBrandCustomCategory", //保存品牌自定义类别
  deleteBrandCustomCategoryGoods: "/brandCustomCategory/deleteBrandCustomCategoryGoods", //移除品牌分类下的商品
  deleteBrandCustomCategory: "/brandCustomCategory/deleteBrandCustomCategory", //删除品牌自定义类别
  queryBrandCustomCategory: "/brandCustomCategory/queryBrandCustomCategory", //查询品牌自定义类别列表
  queryBrandCustomCategoryGoods: "/brandCustomCategory/queryBrandCustomCategoryGoods", //查询品牌类别下的商品列表

  /* 家具类别 沙发 椅子 */
  queryGoodsGategoryList: '/goodsCategory/queryGoodsGategoryList', // 查询家具类别列表
  saveGoodsGategory: '/goodsCategory/saveGoodsGategory', // 保存家具类别
  deleteGoodsGategory: '/goodsCategory/deleteGoodsGategory', // 删除家具类别
  queryGoodsCategoryProperty: '/goodsCategoryProperty/queryGoodsCategoryProperty', // 获取商品类别属性
  saveGoodsCategoryProperty: '/goodsCategoryProperty/saveGoodsCategoryProperty', // 保存商品类别属性
  deleteGoodsCategoryProperty: '/goodsCategoryProperty/deleteGoodsCategoryProperty', // 删除商品类别属性
  queryGoodsCategoryPropertyValue: "/goodsCategoryProperty/queryGoodsCategoryPropertyValue", //编辑商品时查询商品类别关联属性列表

  /* APP管理 -- 开始 */
  // 分类
  queryGoodsSpaceList: '/goodsSpace/queryGoodsSpaceList', // 查询家具类目列表
  saveGoodsSpace: '/goodsSpace/saveGoodsSpace', // 保存家具类目
  deleteGoodsSpace: '/goodsSpace/deleteGoodsSpace', //删除家具类目
  querySpaceGoodsGategoryList: "/goodsCategory/querySpaceGoodsGategoryList", //查询类目下的家具列表
  insertGoodsSpaceGategory: "/goodsSpace/insertGoodsSpaceGategory", //保存分类和家具的关系
  querySpaceNotExistGoodsGategoryList: "/goodsCategory/querySpaceNotExistGoodsGategoryList", //筛查出已选择的家具
  deleteGoodsSpaceCategory: "/goodsCategory/deleteGoodsSpaceCategory", //移除类目下的家具
  setTopGoodsSpace: "/goodsSpace/setTopGoodsSpace", //置顶商品空间
  setTopGoodsSpaceCategory:"/goodsSpace/setTopGoodsSpaceCategory",//置顶商品类目的家具分类
  //系列
  queryGoodsCustomGategoryList: "/goodsCustomCategory/queryGoodsGategoryList", //查询商品自定义类别列表
  saveGoodsCustomCategory: "/goodsCustomCategory/saveGoodsCustomCategory", //保存商品自定义类别信息
  deleteGoodsCustomCategory: "/goodsCustomCategory/deleteGoodsCustomCategory", //删除商品自定义类别信息
  queryGoodsCustomCategoryValueList: "/goodsCustomCategory/queryGoodsCustomCategoryValueList", //查询子系列列表
  saveGoodsCustomCategoryValue: "/goodsCustomCategory/saveGoodsCustomCategoryValue", //保存子系列
  deleteGoodsCustomCategoryValue: "/goodsCustomCategory/deleteGoodsCustomCategoryValue", //删除子系列
  queryGoodsCustomCategoryValueJoin: '/goodsCustomCategory/queryGoodsCustomCategoryValueJoin', // 查询子类关联商品
  queryGoodsCustomCategoryValueNotJoin: '/goodsCustomCategory/queryGoodsCustomCategoryValueNotJoin', // 查询子类不关联商品
  insertGoodsCustomCategoryValueJoin: '/goodsCustomCategory/insertGoodsCustomCategoryValueJoin', // 保存子类关联商品
  deleteGoodsCustomCategoryValueJion: '/goodsCustomCategory/deleteGoodsCustomCategoryValueJion', // 删除子类关联商品
  queryGoodsCustomCategoryValueByGoods: "/goodsCustomCategory/queryGoodsCustomCategoryValueByGoods", //查询自定义分类关联商品
  setTopCustomCategory:"/goodsCustomCategory/setTopCustomCategory",//置顶子系列
  //发现
  queryDiscoveryList: "/discovery/queryDiscoveryList", //查询发现列表
  deleteDiscovery: "/discovery/deleteDiscovery", //删除发现信息
  saveDiscovery: "/discovery/saveDiscovery", //保存发现（新增和编辑）
  queryDiscoveryGoods: "/discovery/queryDiscoveryGoods", //查询发现关联商品
  deleteDiscoveryGoods: "/discovery/deleteDiscoveryGoods", //删除发现关联商品
  saveDiscoveryGoods: "/discovery/saveDiscoveryGoods", //保存发现和商品关系
  // 首页
  // 推荐门店
  setStoreTop: '/homeStore/setTop', // 置顶门店
  queryHomeRetailerStore: '/homeStore/queryHomeRetailerStore', // 查询门店
  saveHomeRetailerStore: '/homeStore/saveHomeRetailerStore', // 设置门店
  deleteHomeRetailerStore: '/homeStore/deleteHomeRetailerStore', // 删除门店
  // 推荐分组
  saveHomeRecommandGroup: '/recommand/saveHomeRecommandGroup', // 保存推荐分组
  deleteHomeRecommandGroup: '/recommand/deleteHomeRecommandGroup', // 删除推荐分组
  queryHomeRecommandGroup: '/recommand/queryHomeRecommandGroup', // 查询分组列表
  setTopGroup: '/recommand/setTopGroup', // 置顶推荐分组
  saveHomeRecommand: '/recommand/saveHomeRecommand', // 保存推荐的商品
  deleteHomeRecommand: '/recommand/deleteHomeRecommand', // 删除推荐商品信息
  setTopRecommand: '/recommand/setTopRecommand', // 置顶推荐商品
  queryHomeRecommand: '/recommand/queryHomeRecommand', // 查询推荐的商品列表
  //引导页
  queryAppStart:"/start/queryAppStart",//查询启动页
  saveAppStart:"/start/saveAppStart",//保存启动页设置
  udpateStart:"/start/udpateStart",//修改状态
  // 主标
  queryHomeMainmark: '/mainmark/queryHomeMainmark', // 查询主标
  deleteHomeMainmark: '/mainmark/deleteHomeMainmark', // 删除主标
  saveHomeMainmark: '/mainmark/saveHomeMainmark', // 保存主标
  setTopHomeMainmark: "/mainmark/setTopHomeMainmark", //置顶主标
  //轮播
  queryHomeDisconveryList: "/homeDiscovery/queryHomeDisconveryList", //查询首页发现轮播列表
  deleteHomeDiscovery: "/homeDiscovery/deleteHomeDiscovery", //删除轮播
  setTopHomeDiscovery: "/homeDiscovery/setTopHomeDiscovery", //置顶轮播
  saveHomeDiscovery: "/homeDiscovery/saveHomeDiscovery", //设置轮播
  //今日新选和特卖好物
  queryHomeHot: "/homehot/queryHomeHot", //今日新选列表
  deleteHomeHot: "/homehot/deleteHomeHot", //删除今日新选
  setTopHomeHot: "/homehot/setTopHomeHot", //置顶今日新选,
  saveHomeHot: "/homehot/saveHomeHot", //保存关联商品

  /* APP管理 -- 结束 */

  /* 定制客户列表 */
  queryCompanyList: '/company/queryCompanyList', // 定制用户列表
  saveCompany: '/company/saveCompany', // 保存定制用户
  deleteCompany: '/company/deleteCompany', // 删除定制用户
  queryCompanyCountrys: "/country/queryCompanyCountrys", //查询定制客户关联国家
  /**商品管理 -- 开始 */
  queryGoodsList: "/goods/queryGoodsList", //查询商品列表
  saveGoodsInfo: "/goods/saveGoodsInfo", //添加商品
  queryGoodsMaterail:"/goods/queryGoodsMaterail",//查询商品材质
  queryBrandCustomCategoryTree: "/brandCustomCategory/queryBrandCustomCategoryTree", //查询品牌自定义分类列表树形结构
  queryGoodsCustomCategoryTree: "/goodsCustomCategory/queryGoodsCustomCategoryTree", //查询商品自定义分类列表树形结构
  setTopGoods: "/goods/setTopGoods", //置顶商品
  deleteGoods: "/goods/deleteGoods", //删除商品信息
  updateGoodsStatus: "/goods/updateGoodsStatus", //修改商品状态
  genGoodsQrcode: "/qrcode/genGoodsQrcode", //商品二维码
  downGoodsQrcode: "/qrcode/downGoodsQrcode", //下载商品二维码
  importGoods:"/excel/importGoods",//导入商品
  exportGoods:"/excel/exportGoods",//导出商品列表
  /**商品管理 -- 结束 */
  /**户型管理   开始 */
  //户型列表
  queryHouseTypeList: "/houseType/queryHouseTypeList", //查询户型列表
  saveHouseType: "/houseType/saveHouseType", //保存户型
  deleteHouseType: "/houseType/deleteHouseType", //删除户型
  //房型列表
  queryHouseRoomList: "/houseRoom/queryHouseRoomList", //查询户型居室列表
  deleteHouseRoom: "/houseRoom/deleteHouseRoom", //删除户型居室
  saveHouseRoom: "/houseRoom/saveHouseRoom", //保存户型居室
  //风格列表
  queryHouseStyleList: "/houseStyle/queryHouseStyleList", //查询户型风格
  deleteHouseStyle: "/houseStyle/deleteHouseStyle", //删除户型风格
  saveHouseStyle: "/houseStyle/saveHouseStyle", //保存户型风格
  /**户型管理   结束 */

  /**商家管理 */
  // 代理商
  queryRetailerList: "/retailer/queryRetailerList", //查询代理商列表
  saveRetailer: "/retailer/saveRetailer", //保存/编辑代理商
  deleteRetailer: "/retailer/deleteRetailer", //删除代理商
  saveRetailerBrand: "/retailer/saveRetailerBrand", //保存代理商关联品牌
  deleteRetailerBrand: "/retailer/deleteRetailerBrand", //删除代理商关联品牌
  queryRetailerBrand: "/brand/queryRetailerBrand", //查询代理商品牌列表
  // 门店
  queryRetailerStoreList: '/retailerStore/queryRetailerStoreList', // 查询门店
  saveRetailerStore: '/retailerStore/saveRetailerStore', // 保存门店
  deleteRetailerStore: '/retailerStore/deleteRetailerStore', // 删除门店
  saveRetailerStoreGoods: '/retailerStore/saveRetailerStoreGoods', // 保存门店关联商品
  deleteRetailerStoreGoods: '/retailerStore/deleteRetailerStoreGoods', // 删除门店关联商品
  queryGoodsListByRetailerStore: '/retailerStore/queryGoodsListByRetailerStore', // 查询门店关联商品
  deleteStoreCustomCategoryGoods: '/storeCustomCategory/deleteStoreCustomCategoryGoods', // 移除门店类别下的商品
  deleteRetailerStoreGoods: '/retailerStore/deleteRetailerStoreGoods', // 删除门店关联商品
  saveStoreCustomCategoryGoods: '/storeCustomCategory/saveStoreCustomCategoryGoods', // 保存商品和门店类别关系
  saveStoreCustomCategory: '/storeCustomCategory/saveStoreCustomCategory', // 保存门店自定义类别
  deleteStoreCustomCategory: '/storeCustomCategory/deleteStoreCustomCategory  ', // 删除门店自定义类别
  queryStoreCustomCategory: '/storeCustomCategory/queryStoreCustomCategory', // 查询门店自定义类别列表
  queryStoreCustomCategoryGoods: '/storeCustomCategory/queryStoreCustomCategoryGoods', // 查询门店类别下的商品列表
  genStoreQrcode: "/qrcode/genStoreQrcode", //门店二维码
  downStoreQrcode: "/qrcode/downStoreQrcode", //下载门店二维码
  // 楼盘
  queryHouseList: '/house/queryHouseList', // 查询楼盘
  saveHouse: '/house/saveHouse', // 保存楼盘
  deleteHouse: '/house/deleteHouse', // 删除楼盘
  queryProvince: '/country/queryProvince', // 查询省份
  queryCity: '/country/queryCity', // 查询城市
  queryDistrict: '/country/queryDistrict', // 查询区域
  //开发商
  queryDevelopersList: "/developers/queryDevelopersList", //开发商列表
  saveDevelopers: "/developers/saveDevelopers", //保存开发商
  deleteDevelopers: "/developers/deleteDevelopers", //删除开发商

  /* 商家管理 */
  /*版本管理 */
  queryAppVersion: "/appVer/queryAppVersion", //app版本列表
  saveAppVersion: "/appVer/saveAppVersion", //保存app版本
  deleteAppVersion: "/appVer/deleteAppVersion" ,//删除app版本
  updateAppVersionStatus:"/appVer/updateAppVersionStatus",//启用app版本状态

  // 定制APP首页轮播
  queryHomeLogo: "/logo/queryHomeLogo", // 获取
  editHomeLogo: "/logo/editHomeLogo", // 编辑
  delHomeLogo: "/logo/delHomeLogo",  // 删除
  saveExchange: "/exchange/saveExchange", // 编辑汇率
  queryExchange: "/exchange/queryExchange", // 查询汇率
  //企业信息管理
  editExtend:"/extend/editExtend",//编辑企业扩展信息
  queryExtend:"/extend/queryExtend",//查询企业扩展信息





















  // login: 'login', // 登录接口
  // register: 'register', // 登录注册
  // /*APP管理-发现*/
  // listfind: 'listfind', // 获取APP管理发现列表
  // addfind: 'addfind', // 增加APP管理发现
  // delfind: 'delfind', // 删除APP管理发现
  // editfind: 'editfind', // 编辑APP管理发现
  // /*APP管理-新闻管理*/
  // newsList:'/news/queryNewsList',//新闻列表
  // newsDetail:"/news/queryNewsById",//查询新闻详情
  // saveNews:"/news/saveNews",//提交和保存新闻
  // deleteNews:"/news/deleteNews",//删除新闻
  // /*上传和删除图片*/
  // upimg: 'upimg', // 上传图片接口
  // delimg: 'delimg', // 删除图片接口
  // /*商家管理-厂家和地产*/
  // listvendor:"listvendor",//厂家列表和地产列表（传的type不一样）
  // delvendor:"delvendor",//厂家列表和地产删除（传的type不一样）
  // addvendor:"addvendor",//厂家和地产添加（传的type不一样）
  // editvendor:"editvendor",//厂家和地产编辑（传的type不一样）
  // /*商家管理-楼盘*/
  // listunit:"listunit",//楼盘列表
  // delunit:"delunit",//楼盘删除
  // addunit:"addunit",//楼盘添加
  // editunit:"editunit",//楼盘编辑
  // /*商家管理-品牌*/
  // listbrand:"listbrand",//品牌列表
  // delbrand:"delbrand",//品牌删除
  // addbrand:"addbrand",//品牌添加
  // editbrand:"editbrand",//品牌编辑
  // /*代理商*/
  // listseller:"listseller",//代理商列表
  // delseller:"delseller",//代理商删除
  // addseller:"addseller",//代理商添加
  // editseller:"editseller",//代理商编辑
  // /*门店管理-门店*/
  // listshop: 'listshop', // 门店列表接口
  // delshop:"delshop",//门店删除接口
  // addshop:"addshop",//门店添加接口
  // editshop:"editshop",//门店编辑接口
  // /*商品列表*/
  // lists: 'lists', // 商品列表
  // /*APP管理-主标管理*/ 
  // listmark: 'listmark', // 主标列表
  // editmark: 'editmark', // 编辑主标
  // addmark: 'addmark', // 添加主标
  // delmark: 'delmark', // 删除主标
  // /*APP-热门门店*/ 
  // setshop: 'setshop', // 设置热门门店
  // listhotshop: 'listhotshop', // 获取热门门店列表
  // unsetshop: 'unsetshop', // 取消设置热门门店
  // /*APP-今日新选*/ 
  // setnew: 'setnew', // 设置特卖好物
  // listnew: 'listnew', // 获取新选列表
  // unsetnew: 'unsetnew', // 取消设置新选
  // /*APP-特卖好物*/ 
  // setbest: 'setbest', // 设置新选列表
  // listbest: 'listbest', // 特卖好物列表
  // unsetbest: 'unsetbest', // 取消设置特卖好物
  // /*APP-推荐分组*/
  // addrec: 'addrec', // 添加分组推荐
  // delrec: 'delrec', // 删除分组推荐
  // editrec: 'editrec', // 编辑分组推荐
  // listrec: 'listrec', // 分组推荐列表
  // setrec: 'setrec', // 设置分组推荐商品列表
  // unsetrec: 'unsetrec', // 取消设置分组推荐商品
  // listrecobj: 'listrecobj', // 获取分组推荐商品列表
  // /*APP-全景搭配*/ 
  // addpano: 'addpano', // 添加全景图
  // delpano: 'delpano', // 删除全景图
  // editpano: 'editpano', // 编辑全景图
  // listpano: 'listpano', // 全景图列表
  // setpno: 'setpno', // 设置全景图为热门
  // unsetpno: 'unsetpno', // 取消设置为热门
  // listpnoobj: 'listpnoobj', // 全景图关联商品列表
  // /*APP-轮播管理*/ 
  // getround: 'getround', // 获取当前轮播的关联code
  // setround: 'setround', // 设置当前轮播的关联code
  // unsetround: 'unsetround', // 取消设置轮播显示

}
