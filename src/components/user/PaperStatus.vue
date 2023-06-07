<script setup lang='ts'>
// 导入需要的库和模块
import JSZip from 'jszip'; // 用于生成压缩文件（zip）
import { Search } from '@element-plus/icons-vue'; // 导入Element Plus的图标
import { ref, reactive } from 'vue'; // 导入Vue 3的ref和reactive函数
import router from '@/router'; // 导入Vue router
import Download from '../icons/download.vue'; // 导入下载图标组件
import DropDown from '../icons/drop_down.vue'; // 导入下拉图标组件
import Upload from '../icons/upload.vue'; // 导入上传图标组件
import type { Paper } from '@/declare'; // 导入Paper类型
import useCurrentInstance from "@/utils/useCurrentInstance"; // 导入自定义Hook
import { configs } from '@/config.js'; // 导入配置文件
import { ElNotification } from 'element-plus'; // 导入Element Plus的通知组件
const { proxy } = useCurrentInstance(); // 使用自定义Hook获取当前实例的代理对象

const downloading = ref(false) // 控制下载状态的响应式引用，false表示未下载，true表示正在下载

// 定义成功和错误的提示消息函数
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

const papers = ref<Paper[]>([]); // 保存所有论文的响应式引用
const paperSearch = ref('') // 保存搜索关键字的响应式引用

// 从本地存储中获取用户数据，如果没有则设置为默认值
const data = localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')!) : { token: null, user: { id: null } }
const token = data.token // 获取用户的token
const id = data.user.id; // 获取用户的id
const identy = data.user.status; // 获取用户的身份状态

// 定义一个异步函数，用于搜索所有论文
const SearchPapers = async () => {
  const response = await proxy.$post(configs.APIS.User.Getallpaper.replace('student', identy), { "id": id, "keyWords": paperSearch.value }, { headers: { 'token': token } })
  if (response.code == 1) {
    papers.value = response.data;
  }
  // console.table(response.data)
}

// 定义一个映射，将论文的状态映射为对应的样式类名
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
  // 文件下载URL
  url = configs.APIS.BaseUrl + '/downloadpaper/' + url;
  downloading.value = true;
  // 使用 fetch 从服务器获取文件
  fetch(url)
    .then(response => response.blob()) // 将获取的响应转换为blob对象
    .then(blob => {
      const filename = name; // 将下载文件的名称设置为传入的参数

      const fileUrl = URL.createObjectURL(blob); // 创建表示blob对象的URL

      let link = document.createElement('a'); // 创建一个新的<a>元素
      link.style.display = 'none'; // 隐藏该元素，因为不希望将其显示在页面上
      link.href = fileUrl; // 将 href 属性设置为 blob 对象的 URL，使链接指向文件
      link.setAttribute('download', filename); // 设置下载属性，当用户点击链接时，浏览器会尝试下载链接的目标，而不是导航到它

      // 将链接元素添加到页面，使我们能够模拟点击它
      document.body.appendChild(link);

      // 模拟点击链接元素，这将导致浏览器开始下载文件
      link.click();

      // 下载启动后，我们不再需要链接元素，所以我们将其从页面中移除
      document.body.removeChild(link);

      // 使用完blob对象的URL后，我们需要撤销它，以释放浏览器的内存资源
      URL.revokeObjectURL(fileUrl);
      setTimeout(() => {
        downloading.value = false;
      }, 500);
    })
    .catch(error => {
      // 如果在文件下载过程中出现任何错误，我们将在控制台中打印错误信息
      console.error('File download error:', error);
      downloading.value = false;
      warn("下载失败");
    });
};

// 定义响应式引用，保存各种类型文件的选中状态
const type_pdf = ref(true);
const type_doc = ref(true);
const type_docx = ref(true);
// 定义一个函数，根据类型检查文件是否被选中
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
// 定义响应式引用，保存各种状态的选中状态
const statu_unknown = ref(true);
const statu_completed = ref(true);
const statu_underReview = ref(true);
const statu_needsModification = ref(true);
// 定义一个函数，根据状态检查是否被选中
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

/**
 * 下载多个文件并打包为一个ZIP文件
 *
 * @param {Record<string, string>} files - 要下载的文件的映射。键是文件名，值是文件的URL。
 */
const downloadFilesAsZip = (files: Record<string, string>) => {
  downloading.value = true
  // 创建一个新的JSZip实例，用于生成ZIP文件
  const zip = new JSZip();

  // 对于每个文件，创建一个Promise，这个Promise会下载该文件，并将其添加到ZIP文件中
  const fetchPromises = Object.keys(files).map((key) => {
    const filename = key;
    const url = files[key];
    return fetch(url) // 从服务器下载文件
      .then(response => response.blob()) // 将响应转换为Blob对象
      .then(blob => {
        zip.file(filename, blob); // 将Blob对象添加到ZIP文件中
      })
      .catch(error => {
        // 如果在下载文件过程中出现错误，打印错误信息
        console.error(`Error downloading file ${filename}:`, error);
      });
  });

  // 等待所有文件都下载完成并添加到ZIP文件中
  Promise.all(fetchPromises)
    .then(() => {
      // 生成ZIP文件的Blob对象
      zip.generateAsync({ type: 'blob' })
        .then(content => {
          // 创建表示ZIP文件的Blob对象的URL
          const fileUrl = URL.createObjectURL(content);
          // 创建一个新的<a>元素，用于下载ZIP文件
          const link = document.createElement('a');
          link.style.display = 'none'; // 隐藏该元素，因为不希望将其显示在页面上
          link.href = fileUrl; // 设置href属性为ZIP文件的URL
          link.setAttribute('download', 'files.zip'); // 设置下载属性，使得点击该元素时会下载ZIP文件
          // 将<a>元素添加到页面中，以便能够模拟点击它
          document.body.appendChild(link);
          link.click(); // 模拟点击<a>元素，开始下载ZIP文件
          // 下载完成后，将<a>元素从页面中移除
          document.body.removeChild(link);
          // 释放URL占用的资源
          URL.revokeObjectURL(fileUrl);
          setTimeout(() => {
            downloading.value = false;
          }, 500);
        })
        .catch(error => {
          // 如果在生成ZIP文件过程中出现错误，打印错误信息
          console.error('Error creating zip file:', error);
          downloading.value = false;
          warn("下载失败！")
        });
    })
    .catch(error => {
      // 如果在下载文件过程中出现错误，打印错误信息
      console.error('Error downloading files:', error);
    });
};

/**
 * 为所有选中的文件生成下载链接，并使用 `downloadFilesAsZip` 函数将它们打包为一个ZIP文件下载
 */
const DownloadAll = () => {
  // 从DOM中选择所有被选中的文件的下载按钮元素
  const selectedFiles = document.querySelectorAll('[selected="true"] .paper_download_button');

  // 创建一个空的对象，用于存储文件名和对应的下载链接
  const fileDict: Record<string, string> = {};

  // 遍历所有选中的文件
  selectedFiles.forEach(fileElement => {
    // 从元素的 'file-name' 属性中获取文件名
    const fileName: string = fileElement.getAttribute('file-name') || '';

    // 生成文件的下载链接，链接由基础URL、静态路径和文件的 'file-link' 属性组成
    const fileLink: string = `${configs.APIS.BaseUrl}/downloadpaper/${fileElement.getAttribute('file-link')}`;

    // 将文件名和对应的下载链接添加到 `fileDict` 对象中
    fileDict[fileName] = fileLink;
  });

  // 调用 `downloadFilesAsZip` 函数，将 `fileDict` 中的所有文件打包为一个ZIP文件并下载
  downloadFilesAsZip(fileDict);
};



const dialogFormVisible = ref(false); // 控制上传对话框的显示隐藏的响应式引用
// 定义上传数据的响应式对象
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
// 定义上传头信息的对象
const uploadHeader = {
  'token': token
}
// 定义打开和确认对话框的函数
const openDialog = () => {
  dialogFormVisible.value = true;
}
const confirmDialog = () => {
  dialogFormVisible.value = false;
}
// 定义上传成功的处理函数
const uploadSuccess = (response: any) => {
  if (response.code == 1) {
    succ('成功！', '论文已上传成功')
    SearchPapers()
  } else {
    warn(response.msg)
  }
}

SearchPapers() // 执行搜索函数，加载所有论文
</script>

<template>
  <section class="paper_status_container">
    <header class="paper_status_header">
      <h1 class="paper_status_headline">我 的 论 文</h1>
      <el-input v-if="id" v-model="paperSearch" class="paper_search" placeholder="搜索" :prefix-icon="Search" clearable
        @change="SearchPapers" />
    </header>
    <hr v-if="id">
    <article class="outer_container" v-loading="downloading">
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
                {{ identy == 'student' ? '上传论文' : '修 改 论 文 状 态' }}
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
                        <el-option v-for="paper in papers" :label="`${paper.title} | ${paper.author}`"
                          :value="paper.id" />
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