// 通过接口定义对象的类型
export interface Teacher {
    id: Number, // 主键
    avatar: string;  // 头像
    userName: string; // 姓名
    account: string; // 账号
    level: string; // 级别
    phone: string;  // 手机号码
    email:string; // 电子邮箱
    createTime: string; // 创建时间和添加人
}