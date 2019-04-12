import VueI18n from 'vue-i18n'//需先安装vue-i18n
import Vue from 'vue'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)
let zh = require('./lang/zh.json')
let en = require('./lang/en.json')
let langMessages = {
 zh:{...zh,...zhLocale},
 en: {...en,...enLocale}
}

let i18n = new VueI18n({
  locale: 'en',
  messages: langMessages
})

let lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
lang = lang.substr(0, 2);//截取lang前2位字符

const language = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').language || ''
let langName = window.sessionStorage.getItem('lang')
if(!language && !langName) {
  if(lang == 'zh'){
    i18n.locale = 'zh'
  } else{
    i18n.locale = 'en'
  }
}


const setLang = (lang) => {
  i18n.locale = lang
  if(lang == 'zh') {
    sessionStorage.setItem("lang", "zh-CN");
  } else {
    sessionStorage.setItem("lang", "en_US");
  }
}
const getLang = () => {
  return i18n.locale
}


Vue.prototype.$setLang = setLang
Vue.prototype.$getLang = getLang

export default i18n