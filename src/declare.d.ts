declare module 'paper' {
  export interface Paper {
    status: string; // 状态
    title: string; // 标题
    author: string; // 作者
    createdAt: Array; // 创建时间
    updatedAt: Array; // 更新时间
    type: string; // 类型
    size: number; // 大小
    downloadLink: string; // 下载链接
    id: string;
  }
}

declare module 'msg' {
  export interface Msg {
    title: string; // 标题
    isNew: boolean; // 是否为新消息
    content: string; // 消息内容
    id: string; // 消息id - 唯一标识
    created: string; // 消息创建时间
    from: string; // 发出消息的人 - (昵称|真实姓名)    
    target: string; // 接收消息的人 - (昵称|真实姓名)
  }
}

declare module 'Student' {
  export interface Student {
    name: string;
    id: string;
  }
}

export type { Paper, Msg, Student };