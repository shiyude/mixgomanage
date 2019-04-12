/**
 * 富文本编辑器的基础默认配置
 */
import "tinymce/themes/modern/theme";
import "tinymce/plugins/advlist";
import "tinymce/plugins/lists";
import "tinymce/plugins/image";
import "tinymce/plugins/table";
import "tinymce/plugins/paste";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/preview";
import "tinymce/plugins/nonbreaking";
const lang = window.sessionStorage.getItem('lang')||"zh-CN"
const editorConfig = {
  language_url: "./static/tinymce/zh_CN.js",
  // language: "zh_CN",//uk代表英文
  language:lang == 'zh-CN'?'zh_CN':"uk",
  branding: false,//去除字数统计时插件的广告
  skin_url: "./static/tinymce/skins/lightgray",
  font_formats : "宋体=宋体;微软雅黑=微软雅黑;新宋体=新宋体 ",
  fontsize_formats: '12px 14px 18px 24px 36px',
  menu: {
    file: { title: "File", items: "newdocument" }
  },
     content_style: `
    *                         { padding:0; margin:0; }
    html, body                { height:100%; }
    img                       { max-width:100%; display:block;height:auto; }
    a                         { text-decoration: none; }
    iframe                    { width: 100%; }
    p                         { line-height:1.6; margin: 0px; }
    table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
    .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
    ul,ol                     { list-style-position:inside; }
  `,
  paste_retain_style_properties: "all",
  paste_word_valid_elements: "*[*]", // word需要它
  paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
  paste_convert_word_fake_lists: false, // 插入word文档需要该属性
  paste_webkit_styles: "all",
  // paste_merge_formats: true,
  nonbreaking_force_tab: true, //不允许用户按tab键时进行元素的选择
  // paste_auto_cleanup_on_paste: false,
  plugins:
    "advlist,lists nonbreaking,image,table,paste,textcolor,colorpicker,wordcount,preview ", // 配置
  toolbar_items_size: "small",
  block_formats:
    "Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;",
  toolbar1: "table | undo redo | formatselect |  uploadimg image", // 工具栏1
  toolbar2:
    " fontsizeselect | forecolor backcolor | fontselect bold italic underline strikethrough | bullist numlist | alignleft aligncenter alignright alignjustify |  outdent indent | removeformat | preview", // 工具栏2
}
export default editorConfig
