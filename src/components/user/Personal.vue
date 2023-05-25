<script setup lang='ts'>
import './Createperson.styl'
import type { UploadProps } from 'element-plus'
// import edit from '@/components/icons/edit.vue'
import { ElNotification } from 'element-plus';
import useCurrentInstance from "@/utils/useCurrentInstance";
import replaceEmptyStrings from "@/utils/replaceEmptyStrings";
import { configs } from '@/config.js';
import { reactive, computed, ref } from 'vue';
import { watch } from 'vue';

const { proxy } = useCurrentInstance();
const data = JSON.parse(localStorage.getItem('user_data') || "") || ""
const token = data.token
const id = data.user.id
const response = await proxy.$post(configs.APIS.User.Select, { "id": id }, { headers: { 'token': token } })
var responseData = replaceEmptyStrings(response.data);
if (responseData.avatar == '未知') {
  responseData.avatar = ''
}
if (responseData.email == '未知') {
  responseData.email = responseData.id + '@bit.edu.cn (默认)'
}
const personaldata = reactive(responseData)

var withoutChange = true;
watch(personaldata, (ov, nv) => {
  withoutChange = false;
})

const Exist = computed(() => {
  return response.code == 1 && personaldata;
});

// console.log(Exist)

const succ = (t: string, m: string) => {
  ElNotification({
    title: t,
    message: m,
    type: 'success',
    showClose: false,
    duration: 1000
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

const save = async () => {
  try {
    const response = await proxy.$post(configs.APIS.User.Update, personaldata, { headers: { 'token': token } })
    if (response.code == 1) {
      succ("保存成功！", "您的信息已成功保存")
    } else {
      warn('保存失败！')
    }
  } catch (error) {
    warn(String(error))
    console.log(error)
  }
}

const cancle = () => {
  Object.assign(personaldata, response.data)
  withoutChange = true;
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  succ("成功！", "头像上传成功！")
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    warn('图片必须是jpg格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    warn('图片大小不得超过2MB')
    return false
  }
  return true
}
const uploadId = {
  "id": personaldata.id
}
const uploadHeader = {
  'token': token
}
</script>

<template>
  <section class="edit_profile_container">
    <header class="edit_profile_header">
      <h1 class="edit_profile_headline">编辑个人资料</h1>
      <hr>
    </header>
    <article class="grid_container">
      <main class="profile_container">
        <dl class="form-group">
          <dt><label for="user_profile_name">昵 称</label></dt>
          <dd>
            <input class="form-control" type="text" v-model="personaldata.name" name="user[profile_name]"
              id="user_profile_name">
            <div class="note">
              你的昵称将出现在消息和个人资料等非正式场合中
            </div>
          </dd>
        </dl>
        <dl class="form-group">
          <dt><label for="user_profile_email">邮 箱</label></dt>
          <dd>
            <input class="form-control" type="text" v-model="personaldata.email" id="user_profile_email">
            <div class="note">
              你的邮箱将用于接收消息和通知，并展示在你的个人资料中
            </div>
          </dd>
        </dl>
        <dl class="form-group">
          <dt><label for="user_profile_bio">个 人 简 介</label></dt>
          <dd>
            <textarea class="form-control" type="text" v-model="personaldata.bio" id="user_profile_bio"></textarea>
            <div class="note">
              你的简介将会展示在你的个人资料中
            </div>
          </dd>
        </dl>
        <dl class="form-group">
          <dt><label for="user_profile_subject">专 业</label></dt>
          <dd>
            <input class="form-control" type="text" v-model="personaldata.subject" name="user[profile_subject]"
              id="user_profile_subject" disabled>
            <div class="note">
              你的专业，不可自己更改，若有错误请联系管理员
            </div>
          </dd>
        </dl>
        <dl class="form-group">
          <dt><label for="user_profile_className">班 级</label></dt>
          <dd>
            <input class="form-control" type="text" v-model="personaldata.className" id="user_profile_className" disabled>
            <div class="note">
              你的班级，不可自己更改，若有错误请联系管理员
            </div>
          </dd>
        </dl>
        <dl class="form-group">
          <dt><label for="user_profile_tutor">导 师</label></dt>
          <dd>
            <input class="form-control" type="text" v-model="personaldata.tutor" id="user_profile_tutor" disabled>
            <div class="note">
              你的导师，不可自己更改，若有错误请联系管理员
            </div>
          </dd>
        </dl>
      </main>
      <aside class="profile_avatar">
        <dl class="form-group">
          <dt><label class="avart_label">头 像</label></dt>
          <section class="avart_section">
            <el-upload class="avatar-uploader" name="image" :data="uploadId" :action="configs.APIS.BaseUrl + configs.APIS.User.Portrait" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="uploadHeader">
              <el-avatar class="avatar" :size="200"
              :src="personaldata.avatar ? configs.APIS.BaseUrl + '/portraits/' + personaldata.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
              :alt="'@' + personaldata.name" />
            </el-upload>
          </section>
        </dl>
        <dl class="form-group">
          <dt><label for="user_profile_realName">真 实 姓 名</label></dt>
          <dd>
            <input class="form-control short" type="text" v-model="personaldata.realName" id="user_profile_realName"
              disabled>
            <div class="note short">
              你的真实姓名，不可自己更改，若有错误请联系管理员
            </div>
          </dd>
        </dl>
        <dl class="form-group">
          <dt><label for="user_profile_id">学 号 或 工 号</label></dt>
          <dd>
            <input class="form-control short" type="text" v-model="personaldata.id" id="user_profile_id" disabled>
            <div class="note short">
              你的序号或工号，不可自己更改，若有错误请联系管理员
            </div>
          </dd>
        </dl>
        <footer class="edit_profile_submit">
          <el-button class="edit_profile_save" type="success" :disabled="withoutChange" @click="save">保存</el-button>
          <el-button class="edit_profile_cancle" type="info" :disabled="withoutChange" @click="cancle">取消</el-button>
        </footer>
      </aside>
    </article>
  </section>
</template>

<style scoped></style>