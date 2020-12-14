<template>
  <div>
    <!--
      @change 当三级分类修改的时候触发。得到所有分类id
      @clearList 当1级分类和2级分类触发的时候触发，清空列表
      :disabled 决定select是否可以使用
     -->
    <Category />
    <SpuShowList v-show="isShow" />
    <SpuUpdateList v-show="!isShow" />
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
    }
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
}
</script>
