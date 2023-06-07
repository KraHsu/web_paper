// 导入Element Plus的通知组件
import { ElNotification } from 'element-plus';

/**
 * 显示成功通知
 *
 * @param t - 通知标题
 * @param m - 通知信息
 */
export const succ = (t: string, m: string): void => {
  // 使用ElNotification组件创建一个新的通知
  // 设置通知的标题、信息、类型（成功）、是否显示关闭按钮（否）和持续时间（2秒）
  ElNotification({
    title: t,
    message: m,
    type: 'success',
    showClose: false,
    duration: 2000,
  });
};

/**
 * 显示错误通知
 *
 * @param m - 通知信息
 */
export const warn = (m: string): void => {
  // 使用ElNotification组件创建一个新的通知
  // 设置通知的标题（错误!!）、信息、类型（错误）和持续时间（2秒）
  ElNotification({
    title: 'Error!!',
    message: m,
    type: 'error',
    duration: 2000,
  });
};
