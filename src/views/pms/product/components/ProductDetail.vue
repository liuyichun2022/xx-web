<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>编辑新闻</span>
    </el-card>
    <el-card class="operate-container" shadow="never" label-width="120px">
      <el-form :model="newsParam" :rules="rules" ref="newsFrom">
        <el-form-item label="新闻标题：" prop="title">
          <el-input v-model="newsParam.title"></el-input>
        </el-form-item>
        <el-form-item label="封面：" prop="coverImg">
          <single-upload v-model="newsParam.coverImg"></single-upload>
        </el-form-item>
        <!--数据绑定-->
        <vue-ueditor-wrap
          v-model="newsParam.content"
          editor-id="xiumi-demo-01"
          :config="editorConfig"
          :editorDependencies="['ueditor.config.js','ueditor.all.js','xiumi-ue-dialog-v5.js', 'xiumi-ue-v5.css']"
          @before-init="addXiumiDialog"
        ></vue-ueditor-wrap>
        <el-form-item>
          <el-button class="littleMarginLeft" type="primary" style="float:right" @click="saveSubmit(newsParam)">保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap' // 引入vue-ueditor-wrap
import SingleUpload from '@/components/Upload/singleUpload'
import {createNews, getNewsById} from '@/api/product'

const defaultNews = {
  id:'',
  title: '',
  coverImg: '',
  content: ''
};
export default {
  name: 'HelloWorld',
  components: {
    //注册组件
    VueUeditorWrap,
    SingleUpload
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newsParam: Object.assign({}, defaultNews),
      rules: {
        title: [
          { required: true, message: '请输入新闻标题', trigger: 'blur' }
        ],
        coverImg: [
          { required: true, message: '请上传新闻封面', trigger: 'blur' }
        ]
      },
      content: '<p>Hello UEditorPlus</p>',
      editorConfig: {
        UEDITOR_HOME_URL: '/static/UEditorPlus/',
        serverUrl: "http://1.13.22.158:8080/ueditor/cos",
        toolbars: [[
          'insertvideo',
          'xiumi-dialog'
        ]],
        paths: {
          ZeroClipboard: "/static/UEditorPlus/ZeroClipboard/"
        },
        catchRemoteImageEnable: true, //设置是否抓取远程图片
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度// 初始容器宽度
        initialFrameHeight: 400,
        initialFrameWidth: '100%'
      }
    };
  },
  created(){
    if(this.isEdit){
      getNewsById(this.$route.query.id).then(response=>{
        this.newsParam=response.data;
      });
    };
  },
  methods: {
    addXiumiDialog(editorId) {
      console.log("editorId")
      console.log("注册秀米弹窗")
      window.UE.registerUI(
        'xiumi-dialog',
        (editor, uiName) => {
          // 创建 “秀米弹窗”
          const dialog = new window.UE.ui.Dialog({
            // 注意：这是 xiumi-ue-dialog-v5.html 文件的访问链接，这个页面会通过 iframe 的方式嵌入到弹窗里
            iframeUrl: '/static/UEditorPlus/xiumi-ue-dialog-v5.html',
            editor,
            name: uiName,
            title: '秀米图文消息助手',
            cssRules: 'width: ' + (window.innerWidth - 60) + 'px; height: ' + (window.innerHeight - 60) + 'px;',
          });

          // 添加自定义按钮用于唤起“秀米弹窗”
          const btn = new window.UE.ui.Button({
            name: 'xiumi-connect',
            title: '秀米',
            cssRules: `background-image: url('//dl.xiumi.us/connect/ue/xiumi-connect-icon.png') !important; background-size: contain;`,
            onclick() {
              dialog.render();
              dialog.open();
            },
          });

          return btn;
        },
        2/* 指定添加到工具栏上的那个位置，默认时追加到最后 */,
        editorId /* 指定这个UI是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */
      );
    },
    saveSubmit(news) {
      console.log(JSON.stringify(this.news))
      createNews(news).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '创建成功',
            type: 'success',
            duration: 1000
          });
          this.$router.push({path: '/news/list'});
        }
      });

    }
  }
}
</script>
<style>
.form-container {
  width: 960px;
}

.form-inner-container {
  width: 800px;
}
</style>


