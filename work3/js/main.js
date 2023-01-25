// JavaScript Document
$(function () {
  visuaslSlide();
  multipleSlide();

  function visuaslSlide() {
    //visual
    let visualBox = $(".visual-box");
    let visualList = visualBox.find(".visual");
    let visualItem = visualBox.find(".visual__item");

    let visualIdx = 0; //비쥬얼 처음 시작점
    let visualCnt = visualItem.length; //비주얼 아이템 요소 갯수
    let visualWidth = 100; //비주얼 아이템 width
    let visualItemMov = visualWidth; //비주얼 이동 거리 계산

    let visualBtn = visualBox.find(".direction-btn");
    let visualPrevBtn = visualBox.find(".direction-btn--left"); //왼쪽 버튼
    let visualNextBtn = visualBox.find(".direction-btn--right"); //오른쪽 버튼

    let visualDockBar = visualBox.find(".dock-bar__stage");
    let visualBarLength = 420 / visualCnt; //bar 길이 (전체 dock-bar길이 / 아이템 수)

    let visualDockBtn = visualBox.find(".dock-btn"); //재생/일시정지버튼
    let visualDockBtnPause = visualBox.find(".dock-btn--pause"); //일시정지버튼
    let visualDockBtnAuto = visualBox.find(".dock-btn--auto"); //재생버튼

    //복사본 생성 및 앞/뒤 추가
    visualList.prepend(visualItem.clone().addClass("clone")); //앞 추가
    visualList.append(visualItem.clone().addClass("clone")); //뒤 추가
    visualDockBar.css("width", visualBarLength);

    //중앙 정렬
    function VisuaslCenterLayer() {
      let visualFullSide = -visualItemMov * visualCnt + "%"; //-이동 거리 * 아이템 갯수
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
    let visualSildeTimer = undefined;
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
      let swiper = undefined;

      $(this).addClass("slide-box--" + index);

      //슬라이드 초기화
      if (swiper != undefined) {
        swiper.destroy();
        swiper = undefined;
      }

      let slideBox = $(".slide-box--" + index);
      let slideList = slideBox.find(".slide");
      let slideItem = slideList.find(".slide__item");

      let slideIdx = 0; //슬라이드 처음 시작점
      let slideCnt = slideItem.length; //아이템 요소 갯수

      if (index == 1) {
        var slideBoxWidth = slideBox.width() / 4;
      } else {
        var slideBoxWidth = slideBox.width() / 3;
      }

      let slideGap = 24; //슬라이드 아이템 간격

      let slideWidth = slideBoxWidth - slideGap / 1.5; //슬라이드 아이템 width

      let itemMov = slideWidth + slideGap; //슬라이드 이동 거리 계산
      let newSlideWidth; //clone된 슬라이드 width

      let btn = slideBox.find(".direction-btn");
      let prevBtn = slideBox.find(".direction-btn--left"); //왼쪽 버튼
      let nextBtn = slideBox.find(".direction-btn--right"); //오른쪽 버튼

      let dockBar = slideBox.find(".dock-bar__stage");
      let barLength = 420 / slideCnt; //bar 길이 (전체 dock-bar길이 / 아이템 수)

      let dockBtn = slideBox.find(".dock-btn"); //재생/일시정지버튼
      let dockBtnPause = slideBox.find(".dock-btn--pause"); //일시정지버튼
      let dockBtnAuto = slideBox.find(".dock-btn--auto"); //재생버튼

      newSlideWidth = slideWidth; //복사한 슬라이드 배열 길이 = 기존 슬라이드 배열 길이

      slideItem.css("width", slideWidth);

      //복사본 생성 및 앞/뒤에 추가
      slideList.css({ gap: slideGap + "px" }); //슬라이드 간격 추가 css
      slideList.prepend(slideItem.clone().addClass("clone")); //앞
      slideList.append(slideItem.clone().addClass("clone")); //뒤
      dockBar.css("width", barLength); //첫 배너 bar길이

      //중앙 정렬
      function centerLayer() {
        let fullSlide = -itemMov * slideCnt + "px"; // -슬라이드 움직이는 거리 * 아이템 요소 갯수
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
      let slideTimer = undefined;

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
