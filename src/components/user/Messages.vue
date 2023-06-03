<script setup lang='ts'>
import './msg.styl'
import type { Msg, Student } from '@/declare';
import { reactive, ref } from 'vue';
import useCurrentInstance from "@/utils/useCurrentInstance";
import { configs } from '@/config.js';
const { proxy } = useCurrentInstance();
// declare module 'msg' {
//   export interface Msg {
//     title: string; // 标题
//     isNew: boolean; // 是否为新消息
//     content: string; // 消息内容
//     id: string; // 消息id - 唯一标识
//     created: string; // 消息创建时间
//     from: string; // 发出消息的人 - (昵称|真实姓名)    
//     to: string; // 接收消息的人 - (昵称|真实姓名)
//   }
// }

function sortMessages(messages: Msg[]): Msg[] {
  return messages.sort((a, b) => {
    // isNew 为 true 的消息优先
    if (a.isNew && !b.isNew) {
      return -1;
    }
    if (!a.isNew && b.isNew) {
      return 1;
    }
    // 如果 isNew 相同，按照时间排序
    const dateA = new Date(a.created[0], a.created[1] - 1, a.created[2]);
    const dateB = new Date(b.created[0], b.created[1] - 1, b.created[2]);

    return dateB.getTime() - dateA.getTime();
  });
}

const data = localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')!) : { token: null, user: { id: null } }
const identy = data.user.status
const id = data.user.id
const token = data.token

var messages: Msg[] = reactive([])
await proxy.$post(configs.APIS.User.QMsg, {
  'id': id
}, {
  headers: { 'token': token }
}).then((res: any) => {
  // console.log(res)
  if (res.code == 1) {
    messages = sortMessages(res.data)
  }
})

const sendMsgDia = ref(false)
const msgData = reactive({
  id: id,
  title: '',
  content: '',
  target: [],
})
var nameList: Student[] = []

const openDia = async () => {
  await proxy.$post(configs.APIS.Teacher.GetStudents, {
    "id": id
  }, {
    headers: { 'token': token }
  }).then((res: any) => {
    nameList = Object.entries(res.data).map(([k, v]) => ({ name: k, id: v }))
    sendMsgDia.value = true
  })
}

const sendMsg = async () => {
  await proxy.$post(configs.APIS.Teacher.SendMsg, msgData, {
    headers: { 'token': token }
  }).then((res: any) => {
    console.log(res)
    sendMsgDia.value = false
  })
}

const notNew = async (id: string) => {
  await proxy.$post(configs.APIS.User.IsOld, {
    'id': id
  }, {
    headers: { 'token': token }
  })
}
</script>

<template>
  <!-- <el-empty :image-size="200" description="暂时没有消息" /> -->
  <section class="paper_msg_container">
    <header class="paper_msg_header">
      <h1 class="paper_msg_headline">我的消息</h1>
      <hr>
    </header>
    <article class="msgs" v-if="messages.length || identy == 'teacher'">
      <el-collapse accordion @change="notNew">
        <el-collapse-item v-if="identy == 'teacher'" disabled class="send_msg">
          <template #title>
            <header class="msg_header send_msg" @click="openDia">
              <section class="msg_header_left">
                <span class="msg_title send_msg">
                  发 消 息
                </span>
              </section>
            </header>
            <el-dialog v-model="sendMsgDia" title="发 送 消 息">
              <el-form :model="msgData">
                <el-form-item label="标题" label-width="140px">
                  <el-input v-model="msgData.title" placeholder="请输入消息的标题" />
                </el-form-item>
                <el-form-item label="内容" label-width="140px">
                  <el-input v-model="msgData.content" placeholder="请输入您要发送的消息" type="textarea" rows="4" />
                </el-form-item>
                <el-form-item label="发给谁？" label-width="140px">
                  <el-select v-model="msgData.target" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
                    placeholder="请选择" style="width: 240px">
                    <el-option v-for="item in nameList" :key="item.name" :label="item.name + ' | ' +  item.id" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="sendMsgDia = false">取消</el-button>
                  <el-button type="primary" @click="sendMsg">
                    发送
                  </el-button>
                </span>
              </template>
            </el-dialog>
          </template>
        </el-collapse-item>
        <el-collapse-item v-for="msg in messages" :name="msg.id" @click="msg.isNew = false">
          <template #title>
            <header class="msg_header" @click="msg.isNew = false">
              <section class="msg_header_left">
                <span class="msg_title">
                  {{ msg.title }}
                </span>
                <span class="isNew">
                  {{ msg.isNew ? 'new' : '' }}
                </span>
              </section>
              <section class="msg_header_right">
                <span class="msg_created">
                  {{ msg.created.join('-') }}
                </span>
                <span class="msg_from">
                  来自：{{ msg.from }}
                </span>
              </section>
            </header>
          </template>
          <div class="msg_content" v-html="msg.content">
          </div>
        </el-collapse-item>
      </el-collapse>
    </article>
    <template v-else>
      <el-empty class="emp" description="暂 无 消 息" />
    </template>
  </section>
</template>

<style scoped></style>