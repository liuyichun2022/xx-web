<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="手机号码：">
            <el-input v-model="listQuery.phone" class="input-width" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="昵称：">
            <el-input v-model="listQuery.nickname" class="input-width" placeholder="昵称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">批量导入</el-button>
      <el-button size="mini" class="btn-add" @click="handleSingleAdd()">添加会员</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="couponTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="手机号码" width="160" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">{{scope.row.nickname}}</template>
        </el-table-column>
        <el-table-column label="注册时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload
        class="upload-demo"
        drag
        action="#"
        :http-request="onUpload"
        accept=".csv"
        :show-file-list="false"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传csv格式文件，文件格式,[姓名, 手机号码, 昵称], 导入后会员默认密码为手机号, 且大小不超过10MB</div>
      </el-upload>
    </el-dialog>

    <el-dialog
      :title="isEdit?'编辑用户':'添加用户'"
      :visible.sync="addMemberDialogVisible"
      width="40%">
      <el-form :model="addMemberForm"
               :rules="addMemberRules"
               ref="addMemberForm"
               label-width="150px" size="small">
        <el-form-item label="帐号：" prop="username">
          <el-input v-model="addMemberForm.username" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="addMemberForm.nickname" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码："  prop="phone">
          <el-input v-model="addMemberForm.phone" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addMemberForm.password" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMemberDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addMember(addMemberForm)" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList, upload, addMember} from '@/api/coupon';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    phone: null,
    name: null,
    nickname: null
  };
  const defaultFlashPromotion = {
    id: null,
    title: null,
    startDate: null,
    endDate: null,
    status: 0
  };
  const defaultMemberInfo = {
    name: null,
    phone: null,
    nickname: null,
    password: null
  };
  export default {
    name:'couponList',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('密码不能小于3位'))
        } else {
          callback()
        }
      };
      return {
        listQuery:Object.assign({},defaultListQuery),
        list:null,
        total:null,
        listLoading:false,
        dialogVisible: false,
        addMemberDialogVisible: false,
        addMemberForm: Object.assign({}, defaultMemberInfo),
        isEdit: false,
        addMemberRules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur', validator: validateUsername}],
          password: [{required: true, message: '请输入密码', trigger: 'blur', validator: validatePass}],
          nickname: [{required: true, message: '请输入昵称', trigger: 'blur'}],
          phone: [{required: true, message: '请输入手机号码', trigger: 'blur'}],
        },
      }
    },
    created(){
      this.getList();
    },
    filters:{
      formatDate(time){
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    methods:{
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      getList(){
        this.listLoading=true;
        fetchList(this.listQuery).then(response=>{
          this.listLoading = false;
          this.list = response.data.list;
          console.log(JSON.stringify(response));
          this.total = response.data.total;
        });
      },
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.flashPromotion = Object.assign({},defaultFlashPromotion);
      },
      handleSingleAdd() {
        this.addMemberDialogVisible = true;
        this.isEdit = false;
        this.addMemberForm = Object.assign({},defaultMemberInfo);
      },
      // 上传文件
      onUpload (file) {
        let formData = new FormData()
        formData.append('file',file.file)
        upload(formData).then((res) => {
          console.log(res)
          this.$message.success("导入成功！")
        }).catch((e) => {
          this.$message.error(e.message)
        })
        this.dialogVisible =false;
      },
      addMember(addMemberForm) {
        console.log(addMemberForm)
        addMember(addMemberForm).then((res) => {
          this.$message.success("添加成功！")
          this.addMemberDialogVisible =false;
        }).catch((e) => {
          this.$message.error(e.message)
        })

      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


