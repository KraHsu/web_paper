export default function replaceEmptyStrings(o) {
    const obj = { ...o };
    // 浅拷贝，避免更改原对象
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // 如果值是对象，进行递归处理
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                replaceEmptyStrings(obj[key]);
            }
            // 如果值为空字符串，替换为“未知”
            else if (obj[key] === '') {
                obj[key] = '未知';
            }
        }
    }
    return obj;
}