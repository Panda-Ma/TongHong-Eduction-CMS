// 通过接口定义对象的类型
export interface Class {
    id: Number, // 主键
    cover: string;  // 封面
    className: string; // 班级名称
    describe: string; // 简介
    classMaster: string;  // 班主任
    num: Number;  // 人数
    createTime: string; //创建时间
}