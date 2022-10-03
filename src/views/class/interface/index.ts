// 通过接口定义对象的类型
export interface Class {
    id: number, // 主键
    cover: string;  // 封面
    className: string; // 班级名称
    describe: string; // 简介
    headTeacherId: string;  // 班主任
    headTeacherName: string;  // 班主任
    studentNum: number;  // 人数
    createTime: string; //创建时间
}

export interface  ClassDialog{
    isShowDialog:boolean,
    data:Class,
    teachers:teacher[]
}

interface teacher{
    id:number,
    name:string
}