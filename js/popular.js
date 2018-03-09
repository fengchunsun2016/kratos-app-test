/**
 * Created by feng on 2018/1/8.
 */

$(document).ready(function () {

  let page = 1;//先加载第一页的内容
  let hasMore = true; //标志：判断是否还有数据


  getData();//默认加载首屏数据


  //上拉加载
  ;(function () {
    let timer = null;
    $(window).on('scroll', function () {
      let scrollH = document.documentElement.scrollHeight || document.body.scrollHeight;
      let innerH = window.innerHeight;
      let scrollT = document.documentElement.scrollTop || document.body.scrollTop;

      if (innerH + scrollT >= scrollH) {
        if (hasMore) {
          $('.load-more').text('正在努力加载...').css('display', 'block');
          clearInterval(timer);
          timer = setTimeout(function () {
            getData();
          }, 100);
        }

      }

    })

  })();


  //下拉刷新
  ;(function () {
    let _start = 0;
    let _end = 0;

    window.addEventListener('touchstart', touchStart);
    window.addEventListener('touchmove', touchMove);
    window.addEventListener('touchend', touchEnd);

    function touchStart(event) {
      let touch = event.targetTouches[0];
      _start = touch.pageY;

    }

    function touchMove(event) {
      let touch = event.targetTouches[0];
      _end = ( touch.pageY - _start);


      if(_end>0&&_end<100){
        $('#main').css({marginTop:_end - 40});
        //alert(_end);

        if($('#pullRefresh').css('display')!='block'){
          $('#pullRefresh').css({display:'block'});
          $('#dropRefresh').css({display:'none'});
          $('#refreshing').css({display:'none'});
        }
      }else if(_end>=100){

        if($('#dropRefresh').css('display')!='block'){
          $('#pullRefresh').css({display:'none'});
          $('#dropRefresh').css({display:'block'});
          $('#refreshing').css({display:'none'});
        }
      }

    }

    function touchEnd(event) {
      $('#main').animate({marginTop:-40,duration:500,easing:'linear'});
      if (_end >= 100) {     //100即手机下滑屏幕的距离
        $('#pullRefresh').css({display:'none'});
        $('#dropRefresh').css({display:'none'});
        $('#refreshing').css({display:'block'});
        location.reload();
      }
    }
  })();


  //获取人气推荐数据
  function getData() {

    $.ajax({
      url : domain + '/shop/index/popular',
      headers : {
        token : token
      },
      method : 'GET',
      dataType : 'json',
      data : { userId, page, type : 2 },
      success : function (data) {

        if (data.code == 'SUCCESS') {
          if (data.list && data.list != []) {
            let list = data.list;

            if (list.length < 20) {
              $('.load-more').text('没有更多数据了！').css('display', 'block');
              hasMore = false;
            } else if (list.length == 20) {
              $('.load-more').css('display', 'none');
            }

            //绑定数据
            let str = ``;
            for (let i = 0; i < list.length; i++) {
              let listItem = list[i];
              //console.log(listItem,'listItem');

              str += `<li class="item" goods-id=${listItem.goodsId} redirect-url=${listItem.redirectUrl}>
                      <div class="pic"><img src=${listItem.imgUrl}></div>
                
                      <div class="info">
                        <div class="name">${listItem.goodsName}</div>
                        <div class="marks">`;

              if (listItem.tags && listItem.tags.length) {
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

              if (listItem.saleType == '01') {
                str += `</div>
                        <div class="bottom">
                          <div class="money">
                            
                            <span class="point-price">${listItem.pointPrice}积分</span>
                            
                          </div>
                          <div class="more"><i class="iconfont icon-more"></i></div>
                        </div>
                      </div>
                
                    </li>`;
              } else if (listItem.saleType == '02') {
                str += `</div>
                        <div class="bottom">
                          <div class="money">
                            <span class="amt-price">${listItem.amtPrice}元</span>
                          </div>
                          <div class="more"><i class="iconfont icon-more"></i></div>
                        </div>
                      </div>
                
                    </li>`;
              } else if (listItem.saleType == '03') {
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

            page = page + 1;

            $('.popular-recommend .list').append(str);


            //点击列表跳转详情
            let $viewList = $('.popular-recommend .list .item');
            $viewList.off('tap');
            $viewList.on('tap', function () {
              let redirectUrl = $(this).attr('redirect-url');
              let goodsId = $(this).attr('goods-id');

              let url = redirectUrl + '?userId=' + userId + '&goodsId=' + goodsId + '&token=' + token;

              App.toDetail(url);

            })

          } else {
            $('.load-more').text('没有更多数据了！').css('display', 'block');
            hasMore = false;
          }


        }
      },
      error : function (err) {
        console.log(err);
      }
    })
  }


})




