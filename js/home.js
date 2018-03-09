/**
 * Created by feng on 2017/12/28.
 */

$(document).ready(function () {

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

          if(list&&list.length) {
            for (let i = 0; i < list.length; i++) {
              let listItem = list[i];
              str += `<div class="swiper-slide">
                        <img src=${listItem.imgUrl} alt="" banner-id=${listItem.id} event-type=${listItem.eventType} redirect-url=${listItem.redirectUrl}>
                      </div>`

            }
            $('#swiper-wrapper').html(str);

            //初始化轮播图
            mySwiper();
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
            //console.log(activeIndex,'activeIndex');
            let $imgs = $('.swiper-wrapper img');
            //console.log($imgs,'$imgs')
            $imgs.each(function (index,item) {
              if(activeIndex==index){

                let redirectUrl = $(item).attr('redirect-url');
                //let bannerId = $(item).attr("banner-id");
                let eventType = $(item).attr("event-type");
                let url;

                if(eventType==1){
                  url = redirectUrl + '&userId=' + userId + '&token=' + token;
                }else if(eventType==2){
                  if(eventType.indexOf('?')==-1){
                    url = redirectUrl + '?userId=' + userId + '&token=' + token;
                  }else{
                    url = redirectUrl + '&userId=' + userId + '&token=' + token;
                  }

                }else if(eventType==3){
                  url = redirectUrl;
                }


                 //进入详情页
                 App.toDetail(url);

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
            
            //进入详情页
            App.toDetail(url);
            
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

      App.toMore(url);

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
                      <div class="pic"><img src=${listItem.imgUrl}></div>
                
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

            //进入详情页
             App.toDetail(url);
          })

        }
      },
      error:function (err) {
        console.log(err);
      }
    })
  }



});










