import request from '/@/utils/request'


export function addCourseApi() {
    return request({})
}

// 获取匹配搜索关键字的Table数据
export function getCourseData(id: Number) {
    return request({
        url: '',
        data: {id},
    })
}