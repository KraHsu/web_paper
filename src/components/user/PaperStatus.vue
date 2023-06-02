<script setup lang='ts'>
import JSZip from 'jszip';
// 文件压缩
import './PaperStatus.styl';
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue';
import router from '@/router';
import Download from '../icons/download.vue';
import DropDown from '../icons/drop_down.vue';
import Upload from '../icons/upload.vue';
import type { Paper } from '@/declare';
import useCurrentInstance from "@/utils/useCurrentInstance";
import { configs } from '@/config.js';

import type { UploadProps, UploadUserFile } from 'element-plus'

const { proxy } = useCurrentInstance();
// 标题 作者 创建时间 更新时间 类型 大小 语言 下载链接
const papers = ref<Paper[]>([]);
const paperSearch = ref('')
const data = localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')!) : { token: null, user: { id: null } }
const token = data.token
const id = data.user.id;
const author = '佚名';
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

const downloadFile = (url: string, name: string) => {
  url = configs.APIS.BaseUrl + '/downloadpaper/' + url;
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const filename = name;

      const fileUrl = URL.createObjectURL(blob);

      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = fileUrl;
      link.setAttribute('download', filename); // 使用提取的文件名作为下载文件的名称

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(fileUrl); // 释放URL对象
    })
    .catch(error => {
      console.error('File download error:', error);
    });
};

const uploadFile = () => {

}

const type_pdf = ref(true);
const type_doc = ref(true);
const type_docx = ref(true);
const checkType = (type: string) => {
  switch (type) {
    case 'doc':
      return type_doc.value;
    case 'docx':
      return type_docx.value;
    case 'pdf':
      return type_pdf.value;
  }
}

const statu_unknown = ref(true);
const statu_completed = ref(true);
const statu_underReview = ref(true);
const statu_needsModification = ref(true);
const checkStatu = (statu: string) => {
  switch (statu) {
    case '未知':
      return statu_unknown.value;
    case '已完成':
      return statu_completed.value;
    case '审核中':
      return statu_underReview.value;
    case '待修改':
      return statu_needsModification.value;
  }
}

const downloadFilesAsZip = (files: Record<string, string>) => {
  const zip = new JSZip();

  const fetchPromises = Object.keys(files).map((key) => {
    const filename = key;
    const url = files[key];
    return fetch(url)
      .then(response => response.blob())
      .then(blob => {
        zip.file(filename, blob);
      })
      .catch(error => {
        console.error(`Error downloading file ${filename}:`, error);
      });
  });

  Promise.all(fetchPromises)
    .then(() => {
      zip.generateAsync({ type: 'blob' })
        .then(content => {
          const fileUrl = URL.createObjectURL(content);
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = fileUrl;
          link.setAttribute('download', 'files.zip');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(fileUrl);
        })
        .catch(error => {
          console.error('Error creating zip file:', error);
        });
    })
    .catch(error => {
      console.error('Error downloading files:', error);
    });
};

const DownloadAll = () => {
  const selectedFiles = document.querySelectorAll('[selected="true"] .paper_download_button');
  const fileDict: Record<string, string> = {};

  selectedFiles.forEach(fileElement => {
    const fileName: string = fileElement.getAttribute('file-name') || '';
    const fileLink: string = `${configs.APIS.BaseUrl}/downloadpaper/${fileElement.getAttribute('file-link')}`;
    // console.table({fileName, fileLink});
    fileDict[fileName] = fileLink;
  });

  downloadFilesAsZip(fileDict);
}

const uploadData = {
  "id": id,
  "author": author,
  "title": 'title',
}
const uploadHeader = {
  'token': token
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
              <th class="paper_statu paper_th">状态
                <el-dropdown trigger="click">
                  <DropDown class="paper_statu_drop_down"></DropDown>
                  <template #dropdown>
                    <section class="dropdown_container">
                      <el-checkbox v-model="statu_unknown" label="未知" size="large" />
                      <el-checkbox v-model="statu_completed" label="已完成" size="large" />
                      <el-checkbox v-model="statu_underReview" label="审核中" size="large" />
                      <el-checkbox v-model="statu_needsModification" label="待修改" size="large" />
                    </section>
                  </template>
                </el-dropdown>
              </th>
              <th class="paper_headline paper_th">标题</th>
              <th class="paper_author paper_th">作者</th>
              <th class="paper_created paper_th">创建时间</th>
              <th class="paper_updated paper_th">更新时间</th>
              <th class="paper_type paper_th">类型
                <el-dropdown trigger="click">
                  <DropDown class="paper_type_drop_down"></DropDown>
                  <template #dropdown>
                    <section class="dropdown_container">
                      <el-checkbox v-model="type_pdf" label=".pdf" size="large" />
                      <el-checkbox v-model="type_doc" label=".doc" size="large" />
                      <el-checkbox v-model="type_docx" label=".docx" size="large" />
                    </section>
                  </template>
                </el-dropdown>
              </th>
              <th class="paper_size paper_th">大小</th>
              <th class="paper_download paper_th">下载链接
                <el-tooltip class="box-item" effect="light" content="下载全部符合条件的文件" placement="top">
                  <Download class="download_all_papers" @click="DownloadAll()"></Download>
                </el-tooltip>
              </th>
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
                <el-upload class="upload-demo" :action="configs.APIS.BaseUrl + configs.APIS.User.Paper" :data="uploadData" :headers="uploadHeader">
                  <button class="paper_download_button">
                    <Upload class="paper_upload_button_icon"></Upload>
                  </button>
                </el-upload>
              </td>
            </tr>
            <template v-if="papers.length">
              <tr v-for="paper in papers" :selected="checkType(paper.type) && checkStatu(paper.status)">
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
                  <button class="paper_download_button" :file-link="paper.downloadLink"
                    :file-name="paper.title + '.' + paper.type" @click="downloadFile(paper.downloadLink, paper.title)">
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

.login_info {
  padding: 0;
}
</style>