/**
 * Created by feng on 2018/1/19.
 */

/*
* 声明：
* 如果  domain = App.getDomain() ，部署时可不做任何修改，说明domain是从app中获取的！！！！！！
* */


// const domain = 'http://192.168.30.14/kratos-app-web';
//const domain = 'http://203.81.244.107/kratos-app-web';
// const domain = 'https://www.easy-mock.com/mock/5a4340d2a3f8d40b6b2b3a1e/kratos';//开发模拟数据接口
// const domain = /apis/;  //本地联调nginx解决跨域专用

const domain = App.getDomain();
const userId = request('userId');
const token = request('token');


//解析url
function request(paras) {
  let url = location.href;
  let paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
  let paraObj = {}
  for (let i = 0; j = paraString[i]; i++) {
    paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
  }
  let returnValue = paraObj[paras.toLowerCase()];
  if (typeof(returnValue) == "undefined") {
    return "";
  } else {
    return returnValue;
  }
}