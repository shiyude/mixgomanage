
// const env = 'development' // 开发环境 
const env = 'test' // 测试环境  
// const env = 'production' // 生产环境
let baseURL = '' // 接口地址
let serviceURL = '' // 服务器域名


switch (env) {
  case 'development': // 开发环境
    baseURL = 'http://192.168.0.123:8080'
    serviceURL = 'http://192.168.0.123:8080'
    break
  case 'test': // 测试环境
    // baseURL = 'http://10.0.0.35/biz/api/'
    baseURL = 'http://192.168.0.145:8082'
    serviceURL = 'http://192.168.0.145:8082'
    break
  case 'production': // 生产环境
    baseURL = 'https://managerapi.58mixgo.com'
    serviceURL = 'https://managerapi.58mixgo.com'
    break
}

export { baseURL, serviceURL }
