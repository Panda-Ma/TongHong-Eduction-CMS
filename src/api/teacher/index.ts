import request from "/@/utils/request";

export function initTeacherTable(){
    return request({
        url:'/teacher/getAll',
        method:'get'
    })
}


export function addTeacher(obj:object){
    return request({
        url:'/teacher/add'
        ,method:'post'
        ,data:obj
    })
}

export function editTeacher(obj:object){
    return request({
        url:'/teacher/updateInfo'
        ,method:'post'
        ,data:obj
    })
}

export function deleteTeacher(obj:object){
    return request({
        url:'/teacher/delete'
        ,method:'post'
        ,data:obj
    })
}

// 获取匹配搜索关键字的Table数据
export function searchTeacherInfo(obj:object) {
    return request({
        url: '/teacher/search',
        method:'get',
        params: obj,
    })
}