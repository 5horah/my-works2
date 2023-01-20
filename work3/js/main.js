// JavaScript Document
$(function () {
  visuaslSlide();
  multipleSlide();

  function visuaslSlide() {
    //visual
    var visualBox = $(".visual-box");
    var visualList = visualBox.find(".visual");
    var visualItem = visualBox.find(".visual__item");

    var visualIdx = 0; //비쥬얼 처음 시작점
    var visualCnt = visualItem.length; //비주얼 아이템 요소 갯수
    var visualWidth = 100; //비주얼 아이템 width
    var visualItemMov = visualWidth; //비주얼 이동 거리 계산

    var visualBtn = visualBox.find(".direction-btn");
    var visualPrevBtn = visualBox.find(".direction-btn--left"); //왼쪽 버튼
    var visualNextBtn = visualBox.find(".direction-btn--right"); //오른쪽 버튼

    var visualDockBar = visualBox.find(".dock-bar__stage");
    var visualBarLength = 420 / visualCnt; //bar 길이 (전체 dock-bar길이 / 아이템 수)

    var visualDockBtn = visualBox.find(".dock-btn"); //재생/일시정지버튼
    var visualDockBtnPause = visualBox.find(".dock-btn--pause"); //일시정지버튼
    var visualDockBtnAuto = visualBox.find(".dock-btn--auto"); //재생버튼

    //복사본 생성 및 앞/뒤 추가
    visualList.prepend(visualItem.clone().addClass("clone")); //앞 추가
    visualList.append(visualItem.clone().addClass("clone")); //뒤 추가
    visualDockBar.css("width", visualBarLength);

    //중앙 정렬
    function VisuaslCenterLayer() {
      var visualFullSide = -visualItemMov * visualCnt + "%"; //-이동 거리 * 아이템 갯수
      visualList.css({ transform: "translateX(" + visualFullSide + ")" });
    }
    VisuaslCenterLayer();

    //슬라이드 이동
    function visualMov(num) {
      //시작점이 아이템num와 같을 경우
      if (visualIdx == visualCnt || visualIdx == -visualCnt) {
        visualList.css({ left: "0px" }); //ul처음 위치

        visualIdx = 0; // 초기화
      } else {
        visualList.stop().animate({ left: visualItemMov * -num + "%" }, 300); //-(아이템*num)만큼 이동
        visualIdx = num;
      }
      //바 길이
      $(visualDockBar).css("width", visualBarLength).addClass("ani-strok"); //배너 길이
      if (visualIdx == visualCnt || visualIdx == -visualCnt) {
        $(visualDockBar).css("width", visualBarLength).addClass("ani-strok"); //첫 배너 bar길이
      } else if (visualIdx > 0) {
        $(visualDockBar)
          .css("width", visualBarLength * (visualIdx + 1)) //배너 bar길이
          .addClass("ani-strok");
      } else if (visualIdx < 0) {
        $(visualDockBar)
          .css("width", -visualBarLength * (visualIdx - 1)) //배너 bar길이
          .addClass("ani-strok");
      }
    }

    //자동 슬라이드
    var visualSildeTimer = undefined;
    function visualAutoSlide() {
      if (visualSildeTimer == undefined) {
        visualSildeTimer = setInterval(function () {
          visualMov(visualIdx + 1);
        }, 1500);
      }
    }
    visualAutoSlide();

    function visualStopSlide() {
      clearInterval(visualSildeTimer);
      visualSildeTimer = undefined;
    }

    //자동 슬라이스 재생/정지
    visualDockBtn.click(function () {
      if ($(this).is(visualDockBtnPause)) {
        visualStopSlide();
        visualDockBtnAuto.css("display", "inline-block");
        visualDockBtnPause.css("display", "none");
      } else if ($(this).is(visualDockBtnAuto)) {
        visualAutoSlide();
        visualDockBtnPause.css("display", "inline-block");
        visualDockBtnAuto.css("display", "none");
      }
    });

    //좌우 슬라이드 버튼
    visualBtn.click(function (e) {
      e.preventDefault();
      visualStopSlide();
      visualDockBtnAuto.css("display", "inline-block");
      visualDockBtnPause.css("display", "none");

      if ($(this).is(visualNextBtn)) {
        visualMov(visualIdx + 1);
      } else if ($(this).is(visualPrevBtn)) {
        visualMov(visualIdx - 1);
      }
    });

    visualItem.each(function (index) {
      $(this).addClass("visual__item--" + index);
    });
  }

  function multipleSlide() {
    $(".slide-box").each(function (index) {
      //slide
      //slide class 변수
      var swiper = undefined;

      $(this).addClass("slide-box--" + index);

      //슬라이드 초기화
      if (swiper != undefined) {
        swiper.destroy();
        swiper = undefined;
      }

      var slideBox = $(".slide-box--" + index);
      var slideList = slideBox.find(".slide");
      var slideItem = slideList.find(".slide__item");

      var slideIdx = 0; //슬라이드 처음 시작점
      var slideCnt = slideItem.length; //아이템 요소 갯수
      var slideWidth = slideItem.width(); //슬라이드 아이템 width
      var slideGap = 24; //슬라이드 아이템 간격
      var itemMov = slideWidth + slideGap; //슬라이드 이동 거리 계산
      var newSlideWidth; //clone된 슬라이드 width

      var btn = slideBox.find(".direction-btn");
      var prevBtn = slideBox.find(".direction-btn--left"); //왼쪽 버튼
      var nextBtn = slideBox.find(".direction-btn--right"); //오른쪽 버튼

      var dockBar = slideBox.find(".dock-bar__stage");
      var barLength = 420 / slideCnt; //bar 길이 (전체 dock-bar길이 / 아이템 수)

      var dockBtn = slideBox.find(".dock-btn"); //재생/일시정지버튼
      var dockBtnPause = slideBox.find(".dock-btn--pause"); //일시정지버튼
      var dockBtnAuto = slideBox.find(".dock-btn--auto"); //재생버튼

      newSlideWidth = slideWidth; //복사한 슬라이드 배열 길이 = 기존 슬라이드 배열 길이

      //복사본 생성 및 앞/뒤에 추가
      slideList.css({ gap: slideGap + "px" }); //슬라이드 간격 추가 css
      slideList.prepend(slideItem.clone().addClass("clone")); //앞
      slideList.append(slideItem.clone().addClass("clone")); //뒤
      dockBar.css("width", barLength); //첫 배너 bar길이

      //중앙 정렬
      function centerLayer() {
        var fullSlide = -itemMov * slideCnt + "px"; // -슬라이드 움직이는 거리 * 아이템 요소 갯수
        slideList.css({ transform: "translateX(" + fullSlide + ")" });
      }
      centerLayer();

      //슬라이드 이동
      function slideBtn(num) {
        //아이템 이동거리 * -슬라이드num
        if (slideIdx == slideCnt || slideIdx == -slideCnt) {
          //마지막 슬라이드 일 때(초기화)
          slideIdx = 0; //슬라이드 시작점 초기화

          slideList.css({ left: "0px" }); //ul 처음 위치로 보내기
        } else {
          slideList.stop().animate({ left: itemMov * -num + "px" }, 300); //-(아이템*num)만큼 이동
          slideIdx = num;
        }
        //바 길이
        $(dockBar)
          .css("width", barLength * (slideIdx + 1))
          .addClass("ani-strok"); //배너 bar길이
        if (slideIdx < 0) {
          $(dockBar)
            .css("width", barLength * (slideIdx + slideCnt + 1)) //-1+6
            .addClass("ani-strok"); //배너 bar길이
        } else if (slideIdx == slideCnt || slideIdx == -slideCnt) {
          $(dockBar).css("width", barLength).addClass("ani-strok");
        }
        // console.log(slideIdx, slideCnt);
      }

      //자동 슬라이드
      var slideTimer = undefined;
      var onoff2 = true;

      function autoSlide() {
        if (slideTimer == undefined) {
          slideTimer = setInterval(function () {
            slideBtn(slideIdx + 1);
          }, 1500);
        }
      }
      autoSlide();

      function stopSlide() {
        clearInterval(slideTimer);
        slideTimer = undefined;
      }

      dockBtn.click(function () {
        if ($(this).is(dockBtnPause)) {
          stopSlide();
          dockBtnAuto.css("display", "inline-block");
          dockBtnPause.css("display", "none");
        } else if ($(this).is(dockBtnAuto)) {
          autoSlide();
          dockBtnPause.css("display", "inline-block");
          dockBtnAuto.css("display", "none");
        }
      });

      //좌우 슬라이드 버튼
      btn.click(function (e) {
        e.preventDefault();
        stopSlide();
        dockBtnAuto.css("display", "inline-block");
        dockBtnPause.css("display", "none");
        if ($(this).is(nextBtn)) {
          slideBtn(slideIdx + 1); //슬라이드 시작점 + 1
        } else if ($(this).is(prevBtn)) {
          slideBtn(slideIdx - 1); //슬라이드 시작점 - 1
        }
      });
    });
  }
});
