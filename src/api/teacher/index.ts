import request from "/@/utils/request";

export function initTeacherTable(){
    return request({
        url:'/teacher/getAll',
        method:'get'
    })
}