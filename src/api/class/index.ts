import request from "/@/utils/request";

export function initClassTable(){
    return request({
        url:'/class/get',
        method:'get'
    })
}

export function addClass(obj:object){
    return request({
        url:'/class/add'
        ,method:'post'
        ,data:obj
    })
}

export function deleteClass(obj:object){
    return request({
        url:'/class/delete'
        ,method:'post'
        ,data:obj
    })
}

export function searchClassInfo(obj:object){
    return request({
        url:'/class/search'
        ,method:'get'
        ,params:obj
    })
}

export function editClass(obj:object){
    return request({
        url:'/class/update'
        ,method:'post'
        ,data:obj
    })
}


export function initPlan(obj:object){
    return request({
        url:'/plan/get',
        method:'get',
        params:obj
    })
}

export function addPlan(obj:object){
    return request({
        url:'/plan/add'
        ,method:'post'
        ,data:obj
    })
}

export function deletePlan(obj:object){
    return request({
        url:'/plan/delete',
        method:'post',
        data:obj
    })
}

export function getLinkedCourse(obj:object){
    return request({
        url:'/class/getClassCourse',
        method:'get',
        params:obj
    })
}

export function bindCourse(obj:object){
    return request({
        url:'/class/bind',
        method:'post',
        data:obj
    })
}

