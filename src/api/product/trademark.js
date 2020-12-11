import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {
  /*
  获取品牌管理分页列表
  */
  //获取数据
  getPageList (page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'GET',
    })
  },
  //删除
  delPageList (id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'DELETE',
    })
  },
  //修改数据
  updatePageList (data) {
    return request({
      url: `${api_name}/update`,
      method: 'PUT',
      data
    })
  },
  //新增请求
  addPageList (data) {
    return request({
      url: `${api_name}/save`,
      method: 'POST',
      data
    })
  }
}
