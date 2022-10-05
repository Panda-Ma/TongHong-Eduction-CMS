import request from "/@/utils/request";

export function initStudentTable(){
    return request({
        url:'/student/getAll',
        method:'get'
    })
}

export function addStudent(obj:object){
    return request({
        url:'/student/add'
        ,method:'post'
        ,data:obj
    })
}

export function deleteStudent(obj:object){
    return request({
        url:'/student/delete'
        ,method:'post'
        ,data:obj
    })
}

export function searchStudentInfo(obj:object){
    return request({
        url:'/student/search'
        ,method:'get'
        ,params:obj
    })
}

export function editStudent(obj:object){
    return request({
        url:'/student/updateInfo'
        ,method:'post'
        ,data:obj
    })
}

export function getLinkedClass(obj:object){
    return request({
        url:'/student/getClass',
        method:'get',
        params:obj
    })
}

export function bindClass(obj:object){
    return request({
        url:'/student/bind',
        method:'post',
        data:obj
    })
}

export function download(){
    return request({
        url:'/student/download'
        ,method:'get'
    })
}

