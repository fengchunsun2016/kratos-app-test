/**
 * Created by feng on 2017/12/27.
 */

$(document).ready(function () {

  const userId = request('userId');
  const token = request('token');
  const goodsId = request('goodsId');
  let redirectUrl = null;

  getOrder();//获取订单页信息
  getPhone();//获取电话


  /*获取确认订单页信息*/
  function getOrder() {
    $.ajax(
      {
        url:domain + "/shop/order/confirm",
        headers: {
          token: token
        },
        method:'GET',
        dataType:"json",
        data:{userId,goodsId},
        success:function (data) {
          if(data.code=='SUCCESS'){
            //console.log(data);
            $('.pic img').attr('src',data.imgUrl);
            $(".info-text .tittle").html(data.goodsName);

            if(data.saleType=='01'){
              $('.info .money .point-price').html(data.pointPrice + '积分');
              $('.go-pay .point-price').html(data.pointPrice + '积分');
              $('.info .money .amt-price').remove();
              $('.go-pay .amt-price').remove();
            }else if(data.saleType=='02'){
              $('.info .money .point-price').remove();
              $('.go-pay .point-price').remove();
              $('.info .money .amt-price').html(data.amtPrice + '元');
              $('.go-pay .amt-price').html(data.amtPrice + '元');
            }else if(data.saleType=='03'){
              $('.info .money .point-price').html(data.pointPrice + '积分 +' );
              $('.go-pay .point-price').html(data.pointPrice + '积分 +');
              $('.info .money .amt-price').html(data.amtPrice + '元');
              $('.go-pay .amt-price').html(data.amtPrice + '元');
            }


            redirectUrl = data.redirectUrl;

          }
        },
        err:function (err) {
          console.log(err);
        }
      }
    )
  }

  /*获取个人信息中的手机号*/
  function getPhone() {
    $.ajax(
      {
        url : domain + "/user/info",
        headers: {
          token: token
        },
        method : 'GET',
        dataType : "json",
        data : { userId },
        success : function (data) {
          if (data.code == 'SUCCESS') {

            let phone = data.phone.substr(0,3)+'****'+data.phone.substr(7,4);
            $('.send-address .phone-num').html(phone);

          }
        },
        err : function (err) {
          console.log(err);
        }
      }
    )
  }

  /*$('.header .tittle .icon-back').tap(function (e) {
    history.go(-1);
  })*/

  $('.go-pay .go').tap(function () {

    let userId = request('userId');
    let goodsId = request('goodsId');
    //let url = '192.168.30.218:1990/detail.html?userId=' + userId + '&goodsId=' + goodsId;

    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端


    if(isiOS){
      window.webkit.messageHandlers.toPay.postMessage(goodsId);
    }else{
      andr.toPay(goodsId);
    }
  })



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

})








