/**
 * Created by feng on 2017/12/28.
 */

$(document).ready(function () {
/*
 http://192.168.30.14:8080/kratos-app-web/
 100000000047
* */


  const userId = request('userId');
  const token = request('token');


  //const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端



  /*整体布局*/
  layout();



  /*整体布局*/
  function layout() {
    $.ajax({
      url:domain + '/shop/index/layout',
      headers: {
        token: token
      },
      method:'GET',
      dataType:'json',
      data:{userId},
      success:function (data) {
        if(data && data.code == 'SUCCESS' && data.layoutId == '001'){

          data.param.banner == '1'?swiper():$('.header').remove();//轮播图
          data.param.brand == '1'?selectGifts():$('.selected-gifts').remove();//精选礼券
          data.param.goods == '1'?popularRecommend():$('.popular-recommend').remove();//人气推荐

        }
      }
    })
  }



  /*头部轮播图*/
  function swiper() {

    //获取轮播图数据
    $.ajax({
      url:domain + '/shop/index/banner',
      headers: {
        token: token
      },
      type:'POST',
      dataType:'json',
      data:{userId},
      success:function (data) {
        if(data.code=='SUCCESS'){
          let list = data.list;
          let str = ``;

          if(list&&list.length>1){
            for(let i=0; i<list.length; i++){
              let listItem = list[i];
              str += `<div class="swiper-slide">
                        <img src=${listItem.imgUrl} alt="" goods-id=${listItem.id} redirect-url=${listItem.redirectUrl}>
                      </div>`

            }
            $('#swiper-wrapper').html(str);

            //初始化轮播图
            mySwiper();
          }else if(list&&list.length==1){//只有一张图片的时候不轮播
            for(let i=0; i<list.length; i++){
              let listItem = list[i];
              str += `<div class="swiper-slide">
                        <img src=${listItem.imgUrl} alt="" goods-id=${listItem.id} redirect-url=${listItem.redirectUrl}>
                      </div>`

            }
            $('#swiper-wrapper').html(str);
          }


        }
      },
      error:function (err) {
        console.log(err,'err')
      }
    })

    //初始化轮播图
    function mySwiper() {
      new Swiper ('.swiper-container', {
        autoplay:true,
        loop:true,
        pagination: {
          el: '.swiper-pagination',
        },
        on:{
          tap: function(){
            let activeIndex = this.activeIndex;
            let $imgs = $('.swiper-wrapper img');
            //console.log($imgs,'$imgs')
            $imgs.each(function (index,item) {
              if(activeIndex==index){
                //console.log(index,item);

                let redirectUrl = $(item).attr('redirect-url');
                let goodsId = $(item).attr("goods-id");
                let url = redirectUrl + '?userId=' + userId +'&goodsId=' + goodsId + '&token=' + token;

                 //进入详情页
                 toDetail(url);

              }
            })

          },
        },
      });
    }

  }


  /*精选礼券（品牌推荐）*/
  function selectGifts() {
    //获取精选礼券数据
    $.ajax({
      url:domain +'/shop/index/brand',
      headers: {
        token: token
      },
      dataType:'json',
      data:{userId},
      success:function (data) {
        //console.log(data,'data');
        if(data&&data.code=='SUCCESS'){
          let list = data.list;
          for(let i=0;i<list.length;i++){
            let listItem = list[i];
            if(listItem.position==1){
              $('.selected-gifts .left img').attr({'src':listItem.imgUrl,'goods-id':listItem.goodsId,'redirect-url':listItem.redirectUrl})
            }else if(listItem.position==2){
              $('.selected-gifts .right-top img').attr({'src':listItem.imgUrl,'goods-id':listItem.goodsId,'redirect-url':listItem.redirectUrl})
            }else if(listItem.position==3){
              $('.selected-gifts .right-bottom img').attr({'src':listItem.imgUrl,'goods-id':listItem.goodsId,'redirect-url':listItem.redirectUrl})
            }
          }


          //点击图片跳转详情页
          let $imgs = $('.selected-gifts img');
          $imgs.tap(function () {
            let redirectUrl = $(this).attr('redirect-url');
            let goodsId = $(this).attr("goods-id");
            let url = redirectUrl + '?userId=' + userId + '&goodsId=' + goodsId + '&token=' + token;

            //console.log(goodsId,'goodsId');

            //let url = '192.168.30.218:1990/detail.html?userId=' + userId + '&goodsId=' + goodsId; //本地联调专用

            //进入详情页
            toDetail(url);

            //开发专用
            //window.location.href = 'detail.html?userId=' + userId + '&goodsId=' + goodsId;

          })
        }


      },
      error:function (err) {
        console.log(err,'err');
      }
    })
  }


  /*人气推荐*/
  function popularRecommend() {

    //点击popular-recommend时跳转到人气推荐页
    $('.popular-recommend .tittle .more').tap(function () {
      let url = domain + '/static/popular.html?userId='+userId + '&token=' + token;

      //window.location.href = 'popular.html?userId='+userId + '&rows=1'; //开发专用

      if(isiOS){
        window.webkit.messageHandlers.more.postMessage(url);
      }else{
        andr.more(url);
      }
    });


    $.ajax({
      url:domain +'/shop/index/popular',
      headers: {
        token: token
      },
      method:'GET',
      dataType:'json',
      data:{ userId , type:1},
      success:function (data) {
        // console.log(data,'popular');
        if(data.code=='SUCCESS'){
          let list = data.list;

          //绑定数据
          let str = ``;
          for(let i=0;i<list.length;i++){
            let listItem = list[i];

            str += `<li class="item" goods-id=${listItem.goodsId} redirect-url=${listItem.redirectUrl}>
                      <div class="pic"><img src=${listItem.imgUrl} alt=${listItem.goodsName}></div>
                
                      <div class="info">
                        <div class="name">${listItem.goodsName}</div>
                        <div class="marks">`;

            if(listItem.tags && listItem.tags.length){

              if(listItem.tags.length<=2){
                for (let j = 0; j < listItem.tags.length; j++) {
                  let tagItem = listItem.tags[j];
                  str += `<span style="background: url(${tagItem.imgUrl}) no-repeat 50% 50%;background-size:100% 100%;">${tagItem.content}</span>`;
                }
              }else if(listItem.tags.length==3){
                for (let j = 0; j < listItem.tags.length; j++) {
                  let tagItem = listItem.tags[j];
                  if(j==0){
                    str += `<p><span style="background: url(${tagItem.imgUrl}) no-repeat 50% 50%;background-size:100% 100%;">${tagItem.content}</span>`;
                  }else if(j==1){
                    str += `<span style="background: url(${tagItem.imgUrl}) no-repeat 50% 50%;background-size:100% 100%;">${tagItem.content}</span></p>`;
                  }else if(j==2){
                    str += `<p><span style="background: url(${tagItem.imgUrl}) no-repeat 50% 50%;background-size:100% 100%;">${tagItem.content}</span></p>`;
                  }

                }
              }

            }

            if(listItem.saleType=='01'){
              str += `</div>
                        <div class="bottom">
                          <div class="money">
                            
                            <span class="point-price">${listItem.pointPrice}积分</span>
                            
                          </div>
                          <div class="more"><i class="iconfont icon-more"></i></div>
                        </div>
                      </div>
                
                    </li>`;
            }else if(listItem.saleType=='02'){
              str += `</div>
                        <div class="bottom">
                          <div class="money">
                            <span class="amt-price">${listItem.amtPrice}元</span>
                          </div>
                          <div class="more"><i class="iconfont icon-more"></i></div>
                        </div>
                      </div>
                
                    </li>`;
            }else if(listItem.saleType=='03'){
              str += `</div>
                        <div class="bottom">
                          <div class="money">
                            
                            <span class="point-price">${listItem.pointPrice}积分 +</span>
                            <span class="amt-price">${listItem.amtPrice}元</span>
                          </div>
                          <div class="more"><i class="iconfont icon-more"></i></div>
                        </div>
                      </div>
                
                    </li>`;
            }

          }




          $('.popular-recommend .list').append(str);



          //点击列表跳转详情
          let $viewList = $('.popular-recommend .list .item');
          $viewList.off('tap');
          $viewList.on('tap',function () {
            let redirectUrl = $(this).attr('redirect-url');
            let goodsId = $(this).attr('goods-id');

            let url = redirectUrl + '?userId=' + userId + '&goodsId=' + goodsId + '&token=' + token;

            //let url = '192.168.30.218:1990/detail.html?userId=' + userId + '&goodsId=' + goodsId;//本地测试专用

            //window.location.href = 'detail.html?userId=' + userId + '&goodsId=' + goodsId;//开发专用

            //进入详情页
             toDetail(url);
          })

        }
      },
      error:function (err) {
        console.log(err);
      }
    })
  }


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

  //进入详情页
  function toDetail(url) {
    if(isiOS){
      window.webkit.messageHandlers.toDetail.postMessage(url);
    }else{
      andr.toDetail(url);
    }
  }


});










