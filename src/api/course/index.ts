import request from '/@/utils/request'

export function initTable(){
    return request({
        url:'/course/getall',
        method:'get'
    })
}


export function addCourse(obj:object){
    return request({
        url:'/course/add'
        ,method:'post'
        ,data:obj
    })
}

export function editCourse(obj:object){
    return request({
        url:'/course/update'
        ,method:'post'
        ,data:obj
    })
}

export function deleteCourse(obj:object){
    return request({
        url:'/course/delete'
        ,method:'delete'
        ,params:obj
    })
}

// 获取匹配搜索关键字的Table数据
export function getCourseData(id: Number) {
    return request({
        url: '',
        data: {id},
    })
}