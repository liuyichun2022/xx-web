<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float: right"
            @click="searchCommendList()"
            type="primary"
            size="small">
            查询结果
          </el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
            <el-form-item label="新闻标题：">
              <el-input style="width: 203px" v-model="listQuery.title" placeholder="新闻标题"></el-input>
            </el-form-item>
            <el-form-item label="昵称：">
              <el-input style="width: 203px" v-model="listQuery.nickName" placeholder="昵称"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：">
              <el-input style="width: 203px" v-model="listQuery.phone" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item label="是否精选：">
              <el-select v-model="listQuery.tag" placeholder="全部" clearable>
                <el-option
                  v-for="item in commendTagOptions"
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
    </el-card>
    <div class="table-container">
      <el-table ref="brandTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column label="用户昵称" align="center" width="120">
          <template slot-scope="scope">{{scope.row.nickName}}</template>
        </el-table-column>
        <el-table-column label="手机号码" align="center" width="120">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="新闻标题" width="200" align="center">
          <template slot-scope="scope">{{scope.row.newsTitle}}</template>
        </el-table-column>
        <el-table-column label="评论"  align="center">
          <template slot-scope="scope">{{scope.row.message}}</template>
        </el-table-column>
        <el-table-column label="创建时间"  align="center" width="160">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="精选" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleTagUpdate(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.tag">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
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
  import {fetchList, updateShowStatus, deleteCommend, wonderfulCommend} from '@/api/brand'

  export default {
    name: 'brandList',
    data() {
      return {
        commendTagOptions: [
          {
            label: "否",
            value: "0"
          },
          {
            label: "是",
            value: "1"
          }
        ],
        operateType: null,
        listQuery: {
          title: null,
          phone: null,
          tag: null,
          pageNum: 1,
          pageSize: 10
        },
        list: null,
        total: null,
        listLoading: true
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleTagUpdate(index, row) {
        let params = new URLSearchParams();
        params.append('id', row.id);
        params.append('tag', row.tag);
        wonderfulCommend(params).then(response => {
          if (row.tag == 1) {
            this.$message({
              message: '精选成功',
              type: 'success',
              duration: 1000
            });
          } else {
            this.$message({
              message: '取消精选成功',
              type: 'success',
              duration: 1000
            });
          }
          this.getList();
        });
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该留言', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCommend(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      },
      handleShowStatusChange(index, row) {
        let data = new URLSearchParams();
        data.append("ids", row.id);
        data.append("showStatus", row.showStatus);
        updateShowStatus(data).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        }).catch(error => {
          if (row.showStatus === 0) {
            row.showStatus = 1;
          } else {
            row.showStatus = 0;
          }
        });
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
      searchCommendList() {
        this.listQuery.pageNum = 1;
        this.getList();
      }
    },
    filters: {
      recommendFilter(value) {
        if (value === 1) {
          return '是';
        } else {
          return '否'
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>


</style>


