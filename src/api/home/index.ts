import request from "/@/utils/request";

export function getNum(){
    return request({
        url:'/user/getNum',
        method:'get'
    })
}

export function getPercentage(){
    return request({
        url:'/user/percentage',
        method:'get'
    })
}

export function getClassStuNum(){
    return request({
        url:'/user/getClassStuNum',
        method:'get'
    })
}