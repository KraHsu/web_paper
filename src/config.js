const configs = {
  APIS: {
    BaseUrl: 'http://api.haichi.top:35924',
    // BaseUrl: 'https://api.haichi.top:23425',
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


