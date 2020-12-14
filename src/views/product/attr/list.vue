<template>
  <div>
    <!-- 当我isShow为false 的时候，上面的那个就需要禁用 -->
    <!-- 自定义事件 -->
    <!--  <Category
      @change="getAttrList"
      :disabled="!isShow"
      @clearList="clearList"
    /> -->
    <Category :disabled="!isShow" />
    <el-card style="margin-top: 50px" v-show="isShow">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="add"
        >添加属性</el-button
      >
      <el-table :data="attrsList" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              v-for="attrVal in row.attrValueList"
              :key="attrVal.id"
              style="margin-right: 5px"
              >{{ attrVal.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="150">
          <!-- 作用域插槽slot-scope 也可以重新命名为v-slot -->
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-popconfirm
              :title="`确定删除${row.attrName}吗？`"
              @onConfirm="delAttrValue(row.id)"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 50px" v-show="!isShow">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addLists"
        :disabled="!attr.attrName"
        >添加属性值</el-button
      >
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <!-- 下一步做的时候让点击的时候变成一个输入框 -->
          <!-- 给定义一个自定义属性，edit ，点击内容的时候，让edit的值为true，显示输入框-->
          <!-- autofocus（element ui组件自动聚焦 -->
          <template v-slot="{ row, $index }">
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              size="mini"
              ref="input"
              autofocus
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="row.edit = false"
            ></el-input>
            <!--  <el-input
              v-if="row.edit"
              v-model="row.valueName"
              size="mini"
              ref="input"
              @onChange="row.edit = false"
            ></el-input> -->
            <span v-else @click="edit(row)">{{ row.valueName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <!-- 作用域插槽slot-scope 也可以重新命名为v-slot -->
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`确定删除 ${row.valueName}吗？`"
              @onConfirm="attr.attrValueList.splice($index, 1)"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="sav">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from '@/components/Category'

export default {
  name: 'AttrList',
  data() {
    return {
      attrsList: [],
      isShow: true,
      attr: {
        attrName: '',
        attrValueList: [],
      },
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
    }
  },
  methods: {
    // 点击切换选项的时候，清空子组件的内容数据attrsList和禁用按钮
    clearList() {
      // 清空数据
      this.attrsList = []
      // 禁用按钮
      this.category.category3Id = ''
    },
    // 点击添加属性，需要显示另一个页面并且内容得清空
    add() {
      this.isShow = false
      this.attr.attrName = ''
      this.attr.attrValueList = []
    },
    // 让表单没有数据的时候直接return出去，进行判断
    editCompleted(row, index) {
      row.edit = false
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1)
        return
      }
    },
    // 保存数据，发起请求，然后进行数据展示
    async sav() {
      // 在这里需要判断是添加，还是修改的保存，从而发送请求
      // 通过判断有没有id，添加的话，系统在保存发起请求会自动配送一个id，而修改的话，是在原数据上面进行修改，是就有id的，
      const isAdd = !this.attr.id
      const data = this.attr
      if (isAdd) {
        // 如果id不存在，就是添加，添加的话，还需要另外两个参数
        // this.attr里面只有attrName和attrValueList
        // 还需要categoryId和categoryLevel
        data.categoryId = this.category.category3Id
        data.categoryLevel = 3
      }

      // 但是不管是保存还是添加，发送的都是同一个请求，然后发送完都是请求的更新页面（然后下一步就是等我切换上面选项按钮的时候，下面的内容是清空的）
      const result = await this.$API.attrs.saveAttrInfo(data)
      if (result.code === 200) {
        this.$message.success('保存数据成功')
        // 保存完数据并且切回展示数据页面
        this.isShow = true
        // 发送请求，然后重新渲染数据
        this.getAttrList(this.category)
      } else {
        this.$message.error(result.message)
      }
    },
    // 删除当前所要删除的属性
    async delAttrValue(id) {
      const result = await this.$API.attrs.deleteAttr(id)
      if (result.code === 200) {
        // this.attrsList= result.data
        // 发送请求，然后重新渲染数据
        this.$message.success('删除属性成功~')
        this.getAttrList(this.category)
      } else {
        this.$message.error(result.message)
      }
    },
    // 点击添加属性按钮，然后添加数据,并且自动获取焦点
    addLists() {
      this.attr.attrValueList.push({
        edit: true,
      })
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    //让输入框显示
    edit(row) {
      // 因为直接设置的话，不是响应式数据，使用set方法，可以让之变成一个响应式数据,set设置的就是响应式数据
      // 当我设置为true的同时，需要将自动获取焦点也给设置上
      this.$set(row, 'edit', true)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    async getAttrList(category) {
      // 这一步将数据保存在this上面的category上面，重新赋值
      this.category = category
      // 然后进行发送请求
      const result = await this.$API.attrs.getAttrList(category)
      if (result.code === 200) {
        // console.log(result.data);
        // 子组件给父组件传递参数 自定义事件
        // 使用全局事件总线，触发的事件的给发送数据，接收数据的给绑定事件
        this.attrsList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
    update(attr) {
      this.isShow = false
      // 这样做的目的是放置attr修改的时候改变原数据,这克隆个是浅复制，必须深度
      // 深度克隆：防止对象中的对象还存在引用关系
      /* this.attr = {

        ...attr,
      } */
      this.attr = JSON.parse(JSON.stringify(attr))
    },
  },
  mounted(){
    // 全局事件总线
      this.$bus.$on("change",this.getAttrList)
      this.$bus.$on("clearList",this.clearList)
  },
   beforeDestroy() {
    // 通常情况下：清除绑定的全局事件
    this.$bus.$off("change", this.handleCategoryChange);
    this.$bus.$off("clearList", this.clearList);
  },
  components: {
    Category,
  },
}
</script>
