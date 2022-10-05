// 通过接口定义对象的类型
export interface Teacher {
    id: Number, // 主键
    name: string; // 姓名
    userName: string; // 账号
    password:string;  // 密码
    level: string; // 级别
    cover: string;  // 头像
    phone: string;  // 手机号码
    email:string; // 电子邮箱
    createTime: string; // 创建时间和添加人
    introduction:string; //简介
}

export interface TeacherDialog{
    data:Teacher
    ,isShowDialog:boolean
}