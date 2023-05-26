<script setup lang='ts'>
import './PaperStatus.styl';
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue';
import router from '@/router';
import Download from '../icons/download.vue';
import Upload from '../icons/upload.vue';
import type { Paper } from '@/declare';
import useCurrentInstance from "@/utils/useCurrentInstance";
import { configs } from '@/config.js';
const { proxy } = useCurrentInstance();
// 标题 作者 创建时间 更新时间 类型 大小 语言 下载链接
const papers = ref<Paper[]>([]);
const paperSearch = ref('')
const data = localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')!) : { token: null, user: { id: null } }
const token = data.token
const id = data.user.id;
const SearchPapers = async () => {
  const response = await proxy.$post(configs.APIS.User.Getallpaper, { "id": id, "keyWords": paperSearch.value }, { headers: { 'token': token } })
  if (response.code == 1) {
    papers.value = response.data;
  }
  console.table(response.data)
}
SearchPapers()

const statusClass: Record<string, string> = {
  "未知": 'unknown',
  '已完成': 'completed',
  '审核中': 'underReview',
  '待修改': 'needsModification'
}

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
      <el-input v-if="id" v-model="paperSearch" class="paper_search" placeholder="搜索" :prefix-icon="Search" clearable
        @change="SearchPapers" />
    </header>
    <hr v-if="id">
    <article class="outer_container">
      <template v-if="papers">
        <table class="my_papers">
          <thead class="my_papers_head" v-if="id">
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
            <tr v-if="id">
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
                  <span class="paper_statu_button" :class="statusClass[paper.status]">
                    {{ paper.status }}
                  </span>
                </td>
                <td class="paper_headline paper_td">{{ paper.title }}</td>
                <td class="paper_author paper_td">{{ paper.author }}</td>
                <td class="paper_created paper_td">{{ paper.createdAt.join('-') }}</td>
                <td class="paper_updated paper_td">{{ paper.updatedAt.join('-') }}</td>
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
            <template v-else-if="id">
              <el-empty class="empty" :image-size="200" description="未找到您的论文" />
            </template>
            <template v-else>
              <el-result class="login_info" icon="info" title="提 示">
                <template #sub-title>
                  <p>查 看 论 文 请 先 登 陆</p>
                </template>
                <template #extra>
                  <el-button type="primary" @click="router.push('/login')">登 陆</el-button>
                </template>
              </el-result>
            </template>
          </tbody>
        </table>
      </template>
    </article>
  </section>
</template>

<style scoped >
hr {
  border: none;
  height: 2px;
  margin: 2px 0;
  background: var(--border-color);
}
.login_info{
  padding: 0;
}
</style>