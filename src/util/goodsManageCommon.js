import Vue from 'vue'
import {
  baseURL
} from '@/config/env'
/**
 * 验证3d模块的数据是否填充完整
 * type=0表示验证材质数据，type=1表示验证模型数据
 * judgeData为需要判断的数据
 * isFinished为默认值，返回给提交时做验证
 */
const judge3dModule = ({
  type = 0,
  judgeData = [],
  obj = {},
  isFinished = false,
}) => {
  if (judgeData.length == 0) {
    return true
  }
  outer: for (let i = 0; i < judgeData.length; i++) {
    if (
      judgeData[i].title == ""
      // || judgeData[i].name == ""
    ) {
      isFinished = false;
      break outer;
    }
    if (judgeData[i].UpImgData.length == 0) {
      isFinished = false;
      break outer
    } else {
      let arr = judgeData[i].UpImgData;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].textName == "") {
          isFinished = false;
          break outer
        }
        isFinished = true;
      }
    }

  }
  if (!isFinished) {
    Vue.prototype.$message({
      message: type == 0 ? obj.$t('verificate_material') : obj.$t('verificate_model'),
      type: "warning"
    });
  }
  return isFinished;
}
const judgeColorData = (data = [], isFinished = true) => { //判断选择颜色的商品主图是否存在
  if (!data.length) {
    return true
  } else {
    for (let i = 0; i < data.length; i++) {
      if (!data[i].logoData.length || !data[i].mainData.length) {
        isFinished = false;
        return false
      }
    }
    return isFinished
  }
}
/**改变材质和模型的数据 
 * type=0代表材质
 * type=1代表模型
 */

const changeModuleData = (arr = [], type = 0) => {
  let newArr = [];
  if (arr.length) {
    for (let i = 0; i < arr.length; i++) {
      let newImgArr = [];
      let imgArr = arr[i].UpImgData;
      for (let i = 0; i < imgArr.length; i++) {
        newImgArr.push({
          name: imgArr[i].textName,
          img: imgArr[i].url
        })
      }
      newArr.push({
        type: type == 0 ? "601" : "602",
        // name: arr[i].name,
        title: arr[i].title,
        mats: newImgArr
      })
    }
  }
  return newArr
}
const changeColorData = (arr = []) => { //改变颜色选择的商品主图数据
  let newArr = [];
  if (arr.length) {
    for (let i = 0; i < arr.length; i++) {
      newArr[i] = {
        code: arr[i].code,
        title: arr[i].title,
        logo: arr[i].material[0] ? arr[i].material[0].url : "",
        material: []
      }
      let materialItem = arr[i].color;
      for (let j = 0; j < materialItem.length; j++) {
        newArr[i].material.push({
          logo: materialItem[j].logo.data[0] ? materialItem[j].logo.data[0].url : "",
          code: materialItem[j].logo.code || "",
          imgs: []
        });
        let mainItem = materialItem[j].main;
        for (let k = 0; k < mainItem.length; k++) {
          newArr[i].material[j].imgs.push(mainItem[k].url)
        }
      }
    }
  }
  return newArr
}
/**
 * 将材质和模型里面的图片全部分离出来
 */
const separateModuleImg = (arr = []) => {
  let newArr = []
  if (arr.length) {
    for (let i = 0; i < arr.length; i++) {
      let imgArr = arr[i].UpImgData;
      for (let i = 0; i < imgArr.length; i++) {
        newArr.push(imgArr[i].src)
      }
    }
  }
  return newArr
}
/**
 * 改变编辑商品和户型时的数据填充在页面中
 */
const changeEditSessionData = (data) => {
  if (!data) {
    return []
  }
  let arr = JSON.parse(data);
  let newArr = [];
  if (arr.length) {
    for (let i = 0; i < arr.length; i++) {
      let newImgArr = [];
      let imgArr = arr[i].mats;
      for (let i = 0; i < imgArr.length; i++) {
        newImgArr.push({
          textName: imgArr[i].name,
          url: imgArr[i].img,
          src: (sessionStorage.getItem("serveUrl") || "") + imgArr[i].img
        })
      }
      newArr.push({
        // name: arr[i].name,
        title: arr[i].title,
        UpImgData: newImgArr
      })
    }
  }
  return newArr
}
/**
 * 筛选动态表单的数据
 * detailData为需要做处理的数据
 * newDetailData为处理过后的数据
 */
const screenDetailData = ({
  detailData = [],
  newDetailData = []
}) => {
  if (detailData.length) {
    for (let i = 0; i < detailData.length; i++) {
      if (typeof (detailData[i].propertyValue) == 'string') {
        newDetailData.push({
          "propertyId": detailData[i].id,
          "propertyValue": detailData[i].propertyValue
        })
      } else {
        newDetailData.push({
          "propertyId": detailData[i].id,
          "propertyValue": detailData[i].propertyValue.join()
        })

      }
    }
  }
  return newDetailData
}
/**
 * 匹配富文本编辑器里面的img标签里面的src
 */
const changeHtmlStr = (htmlString = '', newArr = []) => {
  let patt1 = /<img\b.*?(?:\>|\/>)/gi
  let patt2 = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i
  let arr = htmlString.match(patt1)
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      newArr.push(arr[i].match(patt2)[1])
    }
  }
  return newArr
}
/**
 * 提交的图片匹配缓存的图片
 *useData 表示使用过的图片
 *sessionData表示缓存里面的图片
 *type为0表示处理上传插件上传的图片，type为1表示处理富文本编辑器上传的图片
 */
const changeSession = (useData = [], type = 0, sessionData = []) => {
  let sessionKey = type == 0 ? 'uploadedImg' : 'editorImg';
  sessionData = JSON.parse(window.sessionStorage.getItem(sessionKey))
  if (!sessionData || !sessionData.length || !useData.length) { //缓存里面没有数据或者提交的图片为空时直接跳出
    return false
  }
  for (let i = 0; i < useData.length; i++) { //遍历插件里面的数据匹配缓存里面的数据
    var index = sessionData.indexOf(useData[i]);
    if (index == -1) {
      continue;
    } else {
      sessionData.splice(index, 1)
    }

  }
  window.sessionStorage.setItem(sessionKey, JSON.stringify(sessionData))

}
/**
 * 改变upload上传组件里面的上传数据
 * uploadData为上传组件的数组
 * newData为返回的数组 筛选出src
 */
const changeUploadImg = (uploadData = [], newData = []) => {
  if (uploadData.length) {
    for (let i = 0; i < uploadData.length; i++) {
      newData.push(uploadData[i].src)
    }
  }
  return newData
}

/**
 * 改变upload上传组件里面的上传数据
 * uploadData为上传组件的数组
 * newData为返回的数组 筛选出url
 */
const changeUploadImgUrl = (uploadData = [], str = "") => {
  if (uploadData.length) {
    for (let i = 0; i < uploadData.length; i++) {
      str += uploadData[i].url + ","
    }
  }
  str = str.slice(0, -1);
  return str
}

/**
 * 清楚缓存并且删除缓存里面的图片
 */
const deleteImg = (pathStr = '') => {
  let editorImg = JSON.parse(window.sessionStorage.getItem('editorImg'))
  let uploadedImg = JSON.parse(window.sessionStorage.getItem('uploadedImg'))
  if (!editorImg && !uploadedImg) {
    return false
  } else if (editorImg && !uploadedImg) {
    pathStr = editorImg.join()
  } else if (!editorImg && uploadedImg) {
    pathStr = uploadedImg.join()
  } else {
    pathStr = [...editorImg, ...uploadedImg].join()
  }
  console.log(pathStr)
  if (pathStr !== "") {
    Vue.Post(Vue.api.deleteFile, {
      path: pathStr
    }).then((res) => {
      if (res.code == 0) {
        editorImg && window.sessionStorage.removeItem('editorImg')
        uploadedImg && window.sessionStorage.removeItem('uploadedImg')
      }
    })
  } else {
    editorImg && window.sessionStorage.removeItem('editorImg')
    uploadedImg && window.sessionStorage.removeItem('uploadedImg')
  }
}
/**
 * 清楚缓存并且删除缓存里面的压缩文件
 */
const deleteZip = (pathStr = '') => {
  let uploadedZip = JSON.parse(window.sessionStorage.getItem('uploadedZip'))
  if (!uploadedZip) {
    return false
  } else {
    pathStr = [...uploadedZip].join()
  }
  if (pathStr !== "") {
    Vue.Post(Vue.api.deleteFile, {
      path: pathStr
    }).then((res) => {
      if (res.code == 0) {
        uploadedZip && window.sessionStorage.removeItem('uploadedZip')
      }
    })
  } else {
    uploadedZip && window.sessionStorage.removeItem('uploadedZip')
  }
}
const getLangType = () => { //1代表中文 2代表英文 3代表中英文 
  let lang = JSON.parse(window.sessionStorage.getItem('userInfo')) || {};
  if (lang.language) {
    return lang.language
  } else {
    return 1
  }
}
const addDownUrl = (url = '', lists = [], type = 1) => { //type为1表示商品 type为2表示门店 type=3 下载是商品excel
  const lang = window.sessionStorage.getItem('lang') || 'zh-CN' // 请求的多语言系统
  const userId = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').id || '' //登陆用户的ID
  const token = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').token || ''
  const companyId = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').companyId || ''
  const country = window.sessionStorage.getItem('country') || ''
  const language = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').language || '';
  if (type == 3) {
    return `${baseURL}${url}?lang=${lang}&userId=${userId}&token=${token}&companyId=${companyId}&country=${country}&language=${language}`
  }
  return `${baseURL}${url}?lang=${lang}&userId=${userId}&token=${token}&companyId=${companyId}&country=${country}&language=${language}&${type==1?'goodsIds':'storeIds'}=${lists.join()}`

}
Vue.prototype.$judge3dModule = judge3dModule
Vue.prototype.$judgeColorData = judgeColorData
Vue.prototype.$screenDetailData = screenDetailData
Vue.prototype.$changeHtmlStr = changeHtmlStr
Vue.prototype.$changeSession = changeSession
Vue.prototype.$changeUploadImg = changeUploadImg
Vue.prototype.$changeUploadImgUrl = changeUploadImgUrl
Vue.prototype.$deleteImg = deleteImg
Vue.prototype.$deleteZip = deleteZip
Vue.prototype.$getLangType = getLangType
Vue.prototype.$addDownUrl = addDownUrl
Vue.prototype.$changeModuleData = changeModuleData
// Vue.prototype.$separateModuleImg = separateModuleImg
Vue.prototype.$changeEditSessionData = changeEditSessionData
Vue.prototype.$changeColorData = changeColorData
