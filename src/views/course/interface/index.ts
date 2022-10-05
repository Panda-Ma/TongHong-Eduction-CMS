// 通过接口定义对象的类型
export interface Course {
    id: number, // 主键
    cover: string;  // 封面
    courseName: string; // 课程名字
    describe: string; // 简介
    teacherId: string; // 讲师id
    teacherName: string; // 讲师姓名
    attribute: string;  // 课程类型
    createTime: string; // 创建时间
    courseware:string;  // 课件名
    courseTime:number;  // 课时
}

export interface CourseDialog {
    isShowDialog: boolean;
    data: Course,
    teachers:object
}