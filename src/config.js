const configs = {
  APIS: {
    // BaseUrl: 'http://192.168.137.191:8080',
    BaseUrl: 'https://api.haichi.top:8848',
    User: {
      Login: '/user/login',
      Register: '/user/register',
      UploadFav: '/user/portrait',
      Select: '/student/get',
      Update: '/student/update',
      Portrait: '/file/upload/portrait',
      Getallpaper: '/student/getpapers',
      Fake: '/student/fakepapers',
      Paper: '/file/upload/student/paper',
      QMsg: '/student/querymessage',
      QAnc: '/student/querynotice',
      IsOld: '/student/updatemessage'
    },
    Teacher: {
      GetStudents: '/teacher/getstudents',
      SetStatus: '/file/upload/teacher/paper',
      SendMsg: '/teacher/sendmessage',
    },
    Admin: {
      SendMsg: '/admin/sendnotice',
    }
  },
}

export { configs };


