// 通过接口定义对象的类型
export interface Student {
    id: number, // 主键
    studentName:string, // 姓名
    userName: string; // 用户名/账号
    password:string;    // 密码
    cover: string;  // 头像
    cardId: string; // 学号
    phone: string;  // 手机号码
    qq:string; // QQ号码
    email:string; // 电子邮箱
    introduction:string; // 简介
}

export interface StudentDialog{
    isShowDialog:boolean,
    data:Student
}