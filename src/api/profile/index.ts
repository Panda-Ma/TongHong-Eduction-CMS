import request from "/@/utils/request";

export function getTeacherInfo(obj:object){
    return request({
        url:'/teacher/get'
        ,method:'get'
        ,params:obj
    })
}

export function updateInfo(obj:object){
    return request({
        url:'/teacher/updateInfo'
        ,method:'post'
        ,data:obj
    })
}

export function updateHeader(obj:object){
    return request({
        url:'/teacher/updateHeader'
        ,method:'post'
        ,data:obj
    })
}