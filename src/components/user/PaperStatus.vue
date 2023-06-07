<script setup lang='ts'>
import JSZip from 'jszip';
// 文件压缩

import './PaperStatus.styl';
import { Search } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue';
import router from '@/router';
import Download from '../icons/download.vue';
import DropDown from '../icons/drop_down.vue';
import Upload from '../icons/upload.vue';
import type { Paper } from '@/declare';
import useCurrentInstance from "@/utils/useCurrentInstance";
import { configs } from '@/config.js';
import { ElNotification } from 'element-plus';
const { proxy } = useCurrentInstance();

const downloading = ref(false)

// 提示消息
const succ = (t: string, m: string) => {
  ElNotification({
    title: t,
    message: m,
    type: 'success',
    showClose: false,
    duration: 2000
  })
}

const warn = (m: string) => {
  ElNotification({
    title: 'Error!!',
    message: m,
    type: 'error',
    duration: 2000
  })
}

const papers = ref<Paper[]>([]);
const paperSearch = ref('')
const data = localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')!) : { token: null, user: { id: null } }
const token = data.token
const id = data.user.id;
const identy = data.user.status;
const SearchPapers = async () => {
  const response = await proxy.$post(configs.APIS.User.Getallpaper.replace('student', identy), { "id": id, "keyWords": paperSearch.value }, { headers: { 'token': token } })
  if (response.code == 1) {
    papers.value = response.data;
  }
  // console.table(response.data)
}
SearchPapers()

const statusClass: Record<string, string> = {
  "未知": 'unknown',
  '已完成': 'completed',
  '审核中': 'underReview',
  '待修改': 'needsModification'
}

/**
 * 使用fetch API从服务器下载文件并通过模拟点击事件来保存文件
 *
 * @param {string} url - 需要下载的文件的URL后缀。此后缀将添加到BaseURL后
 * @param {string} name - 下载文件的名称
 */
 const downloadFile = (url: string, name: string) => {
  // 将文件的URL后缀添加到BaseURL后以创建完整的文件下载URL
  url = configs.APIS.BaseUrl + '/downloadpaper/' + url;

  // 使用fetch API从服务器获取文件
  fetch(url)
    .then(response => response.blob()) // 将获取的响应转换为blob对象
    .then(blob => {
      const filename = name; // 将下载文件的名称设置为传入的参数

      const fileUrl = URL.createObjectURL(blob); // 创建表示blob对象的URL

      let link = document.createElement('a'); // 创建一个新的<a>元素
      link.style.display = 'none'; // 隐藏该元素，因为我们不希望将其显示在页面上
      link.href = fileUrl; // 将href属性设置为blob对象的URL，使链接指向我们的文件
      link.setAttribute('download', filename); // 设置下载属性，当用户点击链接时，浏览器会尝试下载链接的目标，而不是导航到它

      // 将链接元素添加到页面，使我们能够模拟点击它
      document.body.appendChild(link);

      // 模拟点击链接元素，这将导致浏览器开始下载文件
      link.click();

      // 下载启动后，我们不再需要链接元素，所以我们将其从页面中移除
      document.body.removeChild(link);

      // 使用完blob对象的URL后，我们需要撤销它，以释放浏览器的内存资源
      URL.revokeObjectURL(fileUrl);
    })
    .catch(error => {
      // 如果在文件下载过程中出现任何错误，我们将在控制台中打印错误信息
      console.error('File download error:', error);
    });
};

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

const dialogFormVisible = ref(false);
const uploadData = reactive({
  "id": id,
  "author": '',
  "title": '',
  "signup": '未签名',
})
const TuploadData = reactive({
  "id": '',
  "status": '',
})
const uploadHeader = {
  'token': token
}

const openDialog = () => {
  dialogFormVisible.value = true;
}

const confirmDialog = () => {
  dialogFormVisible.value = false;
}

const uploadSuccess = (response: any) => {
  if (response.code == 1) {
    succ('成功！', '论文已上传成功')
    SearchPapers()
  } else {
    warn(response.msg)
  }
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
    <article class="outer_container" :v-loading="downloading">
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
              <td class="paper_headline paper_td">
                {{identy == 'student' ? '上传论文' : '修 改 论 文 状 态'}}
              </td>
              <td class="paper_author paper_td"> - </td>
              <td class="paper_created paper_td"> - </td>
              <td class="paper_updated paper_td"> - </td>
              <td class="paper_type paper_td"> - </td>
              <td class="paper_size paper_td"> - </td>
              <td class="paper_download paper_td">
                <button class="paper_download_button" @click="openDialog">
                  <Upload class="paper_upload_button_icon"></Upload>
                </button>
                <el-dialog v-if="identy == 'student'" v-model="dialogFormVisible" title="上传论文">
                  <el-form :model="uploadData">
                    <el-form-item label="作者" label-width="140px">
                      <el-input v-model="uploadData.author" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="标题" label-width="140px">
                      <el-input v-model="uploadData.title">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="是否已签名" label-width="140px">
                      <el-select v-model="uploadData.signup" placeholder="是否已签名">
                        <el-option label="已签名" value="已签名" />
                        <el-option label="未签名" value="未签名" />
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="dialogFormVisible = false">取消</el-button>
                      <el-upload class="upload-demo" :action="configs.APIS.BaseUrl + configs.APIS.User.Paper"
                        :data="uploadData" :headers="uploadHeader" :show-file-list="false" :on-success="uploadSuccess">
                        <el-button type="primary" @click="confirmDialog">
                          上传文件
                        </el-button>
                      </el-upload>
                    </span>
                  </template>
                </el-dialog>
                <el-dialog v-else v-model="dialogFormVisible" title="修改论文状态">
                  <el-form :model="TuploadData">
                    <el-form-item label="文章" label-width="140px">
                      <el-select v-model="TuploadData.id" placeholder="请选择文章">
                        <el-option v-for="paper in papers" :label="`${paper.title} | ${paper.author}`" :value="paper.id" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="是否需要修改" label-width="140px">
                      <el-select v-model="TuploadData.status" placeholder="是否需要修改">
                        <el-option label="需要修改" value="待修改" />
                        <el-option label="无需修改" value="已完成" />
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="dialogFormVisible = false">取消</el-button>
                      <el-upload class="upload-demo" :action="configs.APIS.BaseUrl + configs.APIS.Teacher.SetStatus"
                        :data="TuploadData" :headers="uploadHeader" :show-file-list="false" :on-success="uploadSuccess">
                        <el-button type="primary" @click="confirmDialog">
                          上传文件
                        </el-button>
                      </el-upload>
                    </span>
                  </template>
                </el-dialog>
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

.dialog-footer {
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>