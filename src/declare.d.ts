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

export type { Paper };