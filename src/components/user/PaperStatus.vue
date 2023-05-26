<script setup lang='ts'>
import './PaperStatus.styl';
import Download from '../icons/download.vue';
import Upload from '../icons/upload.vue';
import type { Paper } from '@/declare';
// 标题 作者 创建时间 更新时间 类型 大小 语言 下载链接
var papers: Paper[] = [
  {
    "statu": "未知",
    "title": "探索量子算法",
    "author": "张三",
    "createdAt": "2023-01-01",
    "updatedAt": "2023-01-05",
    "type": "mobi",
    "size": 3072,
    "downloadLink": "javascript:void(0);"
  },
  {
    "statu": "未知",
    "title": "人工智能的社会影响",
    "author": "李四",
    "createdAt": "2023-01-10",
    "updatedAt": "2023-01-15",
    "type": "doc",
    "size": 4096,
    "downloadLink": "http://example.com/ai_impact.doc"
  },
  {
    "statu": "未知",
    "title": "深度学习的前沿",
    "author": "王五",
    "createdAt": "2023-01-20",
    "updatedAt": "2023-01-25",
    "type": "pdf",
    "size": 5120,
    "downloadLink": "http://example.com/deep_learning.pdf"
  },
  {
    "statu": "未知",
    "title": "物联网的安全挑战",
    "author": "赵六",
    "createdAt": "2023-01-30",
    "updatedAt": "2023-02-05",
    "type": "docx",
    "size": 2048,
    "downloadLink": "http://example.com/iot_security.docx"
  },
  {
    "statu": "未知",
    "title": "自动驾驶的道德问题",
    "author": "周七",
    "createdAt": "2023-02-10",
    "updatedAt": "2023-02-15",
    "type": "pdf",
    "size": 3072,
    "downloadLink": "http://example.com/autonomous_driving.pdf"
  },
  {
    "statu": "未知",
    "title": "机器学习在金融中的应用",
    "author": "吴八",
    "createdAt": "2023-02-20",
    "updatedAt": "2023-02-25",
    "type": "doc",
    "size": 4096,
    "downloadLink": "http://example.com/ml_finance.doc"
  },
  {
    "statu": "未知",
    "title": "虚拟现实的未来",
    "author": "郑九",
    "createdAt": "2023-03-01",
    "updatedAt": "2023-03-05",
    "type": "pdf",
    "size": 5120,
    "downloadLink": "http://example.com/vr_future.pdf"
  },
  {
    "statu": "未知",
    "title": "区块链技术的可能性",
    "author": "王十",
    "createdAt": "2023-03-10",
    "updatedAt": "2023-03-15",
    "type": "docx",
    "size": 2048,
    "downloadLink": "http://example.com/blockchain_potential.docx"
  },
  {
    "statu": "未知",
    "title": "云计算的安全性",
    "author": "陈一",
    "createdAt": "2023-03-20",
    "updatedAt": "2023-03-25",
    "type": "pdf",
    "size": 3072,
    "downloadLink": "http://example.com/cloud_security.pdf"
  },
  {
    "statu": "未知",
    "title": "数据科学的重要性",
    "author": "林二",
    "createdAt": "2023-03-30",
    "updatedAt": "2023-04-05",
    "type": "doc",
    "size": 4096,
    "downloadLink": "http://example.com/data_science_importance.doc"
  },
  {
    "statu": "未知",
    "title": "探索量子算法",
    "author": "张三",
    "createdAt": "2023-01-01",
    "updatedAt": "2023-01-05",
    "type": "mobi",
    "size": 3072,
    "downloadLink": "javascript:void(0);"
  },
  {
    "statu": "未知",
    "title": "探索量子算法",
    "author": "张三",
    "createdAt": "2023-01-01",
    "updatedAt": "2023-01-05",
    "type": "mobi",
    "size": 3072,
    "downloadLink": "javascript:void(0);"
  },
  {
    "statu": "未知",
    "title": "探索量子算法",
    "author": "张三",
    "createdAt": "2023-01-01",
    "updatedAt": "2023-01-05",
    "type": "mobi",
    "size": 3072,
    "downloadLink": "javascript:void(0);"
  },
  {
    "statu": "未知",
    "title": "探索量子算法",
    "author": "张三",
    "createdAt": "2023-01-01",
    "updatedAt": "2023-01-05",
    "type": "mobi",
    "size": 3072,
    "downloadLink": "javascript:void(0);"
  },
  {
    "statu": "未知",
    "title": "探索量子算法",
    "author": "张三",
    "createdAt": "2023-01-01",
    "updatedAt": "2023-01-05",
    "type": "mobi",
    "size": 3072,
    "downloadLink": "javascript:void(0);"
  },
  {
    "statu": "未知",
    "title": "探索量子算法",
    "author": "张三",
    "createdAt": "2023-01-01",
    "updatedAt": "2023-01-05",
    "type": "mobi",
    "size": 3072,
    "downloadLink": "javascript:void(0);"
  },
  {
    "statu": "未知",
    "title": "探索量子算法",
    "author": "张三",
    "createdAt": "2023-01-01",
    "updatedAt": "2023-01-05",
    "type": "mobi",
    "size": 3072,
    "downloadLink": "javascript:void(0);"
  },
];

const clickLink = (url: string) => {
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const uploadFile = () => {

}
</script>

<template>
  <section class="paper_status_container">
    <header class="paper_status_header">
      <h1 class="paper_status_headline">我 的 论 文</h1>
      <hr>
    </header>
    <article class="outer_container">
      <template v-if="papers">
        <table class="my_papers">
          <thead class="my_papers_head">
            <!-- 标题 作者 创建时间 更新时间 类型 大小 语言 下载链接 -->
            <tr>
              <th class="paper_statu paper_th">状态</th>
              <th class="paper_headline paper_th">标题</th>
              <th class="paper_author paper_th">作者</th>
              <th class="paper_created paper_th">创建时间</th>
              <th class="paper_updated paper_th">更新时间</th>
              <th class="paper_type paper_th">类型</th>
              <th class="paper_size paper_th">大小</th>
              <th class="paper_download paper_th">下载链接</th>
            </tr>
          </thead>
          <tbody class="my_paper_body">
            <tr>
              <td class="paper_statu paper_td"></td>
              <td class="paper_headline paper_td">上传论文</td>
              <td class="paper_author paper_td"> - </td>
              <td class="paper_created paper_td"> - </td>
              <td class="paper_updated paper_td"> - </td>
              <td class="paper_type paper_td"> - </td>
              <td class="paper_size paper_td"> - </td>
              <td class="paper_download paper_td">
                <button class="paper_download_button" @click="uploadFile()">
                  <Upload class="paper_upload_button_icon"></Upload>
                </button>
              </td>
            </tr>
            <template v-if="papers.length">
              <tr v-for="paper in papers">
                <td class="paper_statu paper_td">
                  <span class="paper_statu_button">
                    {{ paper.statu }}
                  </span>
                </td>
                <td class="paper_headline paper_td">{{ paper.title }}</td>
                <td class="paper_author paper_td">{{ paper.author }}</td>
                <td class="paper_created paper_td">{{ paper.createdAt }}</td>
                <td class="paper_updated paper_td">{{ paper.updatedAt }}</td>
                <td class="paper_type paper_td">
                  <span class="paper_type_button" :class="paper.type">
                    .{{ paper.type }}
                  </span>
                </td>
                <td class="paper_size paper_td">{{ paper.size }}</td>
                <td class="paper_download paper_td">
                  <button class="paper_download_button" @click="clickLink(paper.downloadLink)">
                    <Download class="paper_dowload_button_icon"></Download>
                  </button>
                </td>
              </tr>
            </template>
            <template v-else>
              <el-empty class="empty" :image-size="200" description="暂时没有论文" />
            </template>
          </tbody>
        </table>
      </template>
    </article>
  </section>
</template>

<style scoped></style>