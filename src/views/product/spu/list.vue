<template>
  <div>
    <!--
      @change 当三级分类修改的时候触发。得到所有分类id
      @clearList 当1级分类和2级分类触发的时候触发，清空列表
      :disabled 决定select是否可以使用
     -->
    <Category />
    <SpuShowList v-if="isShow" @showUpdateList="showUpdateList" />
    <SpuUpdateList v-else :item="item" />
  </div>
</template>

<script>
import Category from '@/components/Category'
import SpuShowList from './spuShowList'
import SpuUpdateList from './SpuUpdateList'

export default {
  name: 'SpuList',
  data() {
    return {
      isShow: true,
      item: {},
    }
  },
  methods: {
    showUpdateList(row) {
      // 讲isShow改成false，就会显示另一个页面了
      this.isShow = false
      // 并且将数据传给过去
      this.item = { ...row }
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
}
</script>
