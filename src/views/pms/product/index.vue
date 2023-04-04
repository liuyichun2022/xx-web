<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.title" placeholder="新闻标题"></el-input>
          </el-form-item>
          <el-form-item label="作者：">
            <el-input style="width: 203px" v-model="listQuery.publisher" placeholder="作者"></el-input>
          </el-form-item>
          <el-form-item label="发布状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="small">
        添加新闻
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                datalistloading: false
                border>
        <el-table-column label="新闻标题"  align="center"  width="280" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="作者" width="100" align="center">
          <template slot-scope="scope">{{scope.row.publisher}}</template>
        </el-table-column>
        <el-table-column label="发布时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.pubTime}}</template>
        </el-table-column>
        <el-table-column label="封面" width="200" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.coverImg"></template>
        </el-table-column>
        <el-table-column label="阅读数" width="100" align="center">
          <template slot-scope="scope">{{scope.row.readNum}}</template>
        </el-table-column>
        <el-table-column label="点赞数" width="100" align="center">
          <template slot-scope="scope">{{scope.row.likesNum}}</template>
        </el-table-column>
        <el-table-column label="开启评论" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleCommendStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.commendStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="上架/下架" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handlePublishStatus(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.pubStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleShowNews(scope.$index, scope.row)"
                v-show="scope.row.pubStatus===1">查看
              </el-button>
              <el-button
                size="mini"
                @click="handleUpdateNews(scope.$index, scope.row)"
                v-show="scope.row.pubStatus===0">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {
    fetchList,
    deleteNews,
    updateCommendStatus,
    publish
  } from '@/api/product'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    publishStatus: null,
    title: null,
    publisher: null
  };
  export default {
    name: "productList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
        productCateOptions: [],
        brandOptions: [],
        publishStatusOptions: [{
          value: 0,
          label: '草稿'
        }, {
          value: 1,
          label: '已上架'
        }],
        commendData:{id:0,commentStatus:0}
      }
    },
    created() {
      this.getList();
    },
    filters: {
      verifyStatusFilter(value) {
        if (value === 1) {
          return '审核通过';
        } else {
          return '未审核';
        }
      },
      publishStatusFilter(status) {
        if (status === 0) {
          return '草稿';
        } else {
          return '已上架';
        }
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
          console.log(JSON.stringify(response))
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleAddProduct() {
        this.$router.push({path:'/news/add'});
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleResetSearch() {
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleDelete(index, row){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append('id', row.id);
          deleteNews(params).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
          });
          this.getList();
        });
      },
      handleUpdateNews(index,row){
        this.$router.push({path:'/news/edit',query:{id:row.id}});
      },
      handleShowNews(index,row){
        this.$router.push({path:'/news/detail',query:{id:row.id}});
      },
      handleCommendStatusChange(index, row) {
        let params = new URLSearchParams();
        params.append('id', row.id);
        params.append('commendStatus', row.commendStatus);
        updateCommendStatus(params).then(response => {

          if (row.commendStatus === 1) {
            this.$message({
              message: '开启成功',
              type: 'success',
              duration: 1000
            });
          } else {
            this.$message({
              message: '关闭成功',
              type: 'success',
              duration: 1000
            });
          }
        });
      },
      handlePublishStatus(index,row){
        let params = new URLSearchParams();
        params.append('id', row.id);
        params.append('pubStatus', row.pubStatus);
        publish(params).then(response => {
          if (row.pubStatus === 1) {
            this.$message({
              message: '上架成功',
              type: 'success',
              duration: 1000
            });
          } else {
            this.$message({
              message: '下架成功',
              type: 'success',
              duration: 1000
            });
          }
          this.getList();
        });
      }
    }
  }
</script>
<style></style>


