const configs = {
  APIS: {
    BaseUrl: 'http://192.168.137.191:8080',
    // BaseUrl: 'https://api.haichi.top:8080',
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
      SetStatus: '/teacher/setstatus',
    }
  },
}

export { configs };


