/**
 * Created by feng on 2017/12/25.
 */

$(document).ready(function () {

  let userId = request('userId');
  let goodsId = request('goodsId');
  let token = request('token');


  getTotal(); //更新库存



  let mySwiper = new Swiper ('.swiper-container', {
    loop:true,
    pagination: {
      el: '.swiper-pagination',
    },
  });


  $('.button-buy').tap(function (e) {

    let url = domain + '/static/order.html?userId=' + userId + '&goodsId=' + goodsId + '&token=' + token;

    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //window.location.href = 'order.html?userId=' + userId + '&goodsId=' + goodsId;

    if(isiOS){
      window.webkit.messageHandlers.toBuy.postMessage(url);
    }else{
      andr.toBuy(url);
    }
  })

  // 发起请求，更新库存
  function getTotal() {
    $.ajax({
      url: domain + '/shop/goods/inventory',
      headers: {
        token: token
      },
      method:'GET',
      dataType:'json',
      data:{userId, goodsId},
      success:function (data) {
        if(data && data.code == 'SUCCESS'){
          $('#total').text(data.total)
        }
      }
    })
  }



  //解析url
  function request(paras) {
    let url = location.href;
    let paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    let paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
      paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    let returnValue = paraObj[paras.toLowerCase()];
    if (typeof(returnValue) == "undefined") {
      return "";
    } else {
      return returnValue;
    }
  }



});

