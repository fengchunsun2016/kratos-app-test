/**
 * Created by feng on 2017/12/25.
 */

$(document).ready(function () {

  let userId = request('userId');
  let goodsId = request('goodsId');
  let token = request('token');


  getTotal(); //更新库存
  getDetailSwiper();//获取详情轮播图数据并初始化
  getDetailInfo();//获取详情info
  getDetailImgs();//获取底部详情图片


  function initSwiper() {
    let mySwiper = new Swiper ('.swiper-container', {
      loop:true,
      pagination: {
        el: '.swiper-pagination',
      },
    });
  }


  //立即购买
  function goBuy() {
    $('.button-buy').tap(function (e) {

      let url = domain + '/static/order.html?userId=' + userId + '&goodsId=' + goodsId + '&token=' + token;

      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端


      if(isiOS){
        window.webkit.messageHandlers.toBuy.postMessage(url);
      }else{
        andr.toBuy(url);
      }
    })
  }


  // 更新库存
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
          $('#total').text(data.total);
          if(data.total > 0){
            goBuy();
          }else{
            $('.button-buy').css({'backgroundColor':'#d7d7d7'})
          }
        }
      }
    })
  }

  // 获取详情轮播图片
  function getDetailSwiper() {
    $.ajax({
      url: domain + '/shop/goods/img',
      headers: {
        token: token
      },
      method:'GET',
      dataType:'json',
      data:{userId, goodsId},
      success:function (data) {
        if(data && data.code == 'SUCCESS'){
          let list = data.list;
          let str=``;
          if(list&&list.length){
            for(let i=0;i<list.length;i++){
              let listItem = list[i];

              str += `<div class="swiper-slide">
        <img src="${listItem.imgUrl}" alt="">
      </div>`
            }
          }

          $('#swiper-wrapper').html(str);

          initSwiper(); //初始化轮播图
        }
      }
    })
  }

  // 获取详情文字信息
  function getDetailInfo() {
    $.ajax({
      url: domain + '/shop/goods/info',
      headers: {
        token: token
      },
      method:'GET',
      dataType:'json',
      data:{userId, goodsId},
      success:function (data) {
        if(data && data.code == 'SUCCESS'){
          $('#goodsName').html(data.goodsName);
          if(data.payMode=='01'){
            $('#money').html(data.pointPrice + '积分')
          }else if(data.payMode=='02'){
            $('#money').html(data.amtPrice + '元')
          }else if(data.payMode=='03'){
            $('#money').html(data.pointPrice + '积分' + '+' +data.amtPrice + '元')
          }
          if(data.expressFlag==0){
            $('#expressFee').html('免费');
          }else if(data.expressFlag==1){
            $('#expressFee').html(data.expressFee);
          }

          $('#goodsDesc').html(data.goodsDesc);
        }
      }
    })
  }

  // 获取详情图片
  function getDetailImgs() {
    $.ajax({
      url: domain + '/shop/goods/detail',
      headers: {
        token: token
      },
      method:'GET',
      dataType:'json',
      data:{userId, goodsId},
      success:function (data) {
        if(data && data.code == 'SUCCESS'){
          let list = data.list;
          let str = ``;
          if(list&&list.length){
            for(let i=0;i<list.length;i++){
              let listItem = list[i];
              str += `<img src="${listItem.imgUrl}" alt="">`
            }
          }
          $('#images').html(str);
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

