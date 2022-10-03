import request from '/@/utils/request'

export function initCourseTable(){
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
        ,method:'post'
        ,data:obj
    })
}

// 获取匹配搜索关键字的Table数据
export function searchCourseInfo(obj:object) {
    return request({
        url: '/course/search',
        method:'get',
        params: obj,
    })
}

export function initCatalog(obj:object){
    return request({
        url:'/chapter/get',
        method:'get',
        params:obj
    })
}

export function addCatalog(obj:object){
    return request({
        url:'/chapter/add'
        ,method:'post'
        ,data:obj
    })
}

export function editCatalog(obj:object){
    return request({
        url:'/chapter/update'
        ,method:'post'
        ,data:obj
    })
}

export function deleteCatalog(obj:object){
    return request({
        url:'/chapter/delete',
        method:'post',
        data:obj
    })
}