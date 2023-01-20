// JavaScript Document

//visual
$(function () {
  var visualParent = $(".visual");
  var dockBar = visualParent.find(".dock-bar__stage"); //배너 순서 별 bar 길이
  var bannerClass = visualParent.find(".container"); //배너 class
  var bannerEachClass = ".container--0"; //N배너 class
  var bannerImgClass = visualParent.find(".main-image"); //배너 class
  var barBtn = visualParent.find(".visual .dock-btn--"); //재생 버튼 auto,pause로 구분

  var barLength = "210"; //bar 길이 (전체 dock-bar길이 / 배너 수)

  var bannerCnt = 2; //배너 수
  var cnt = 1; //최초 배너 순서

  var bannerImgSize = $(window).width(); //해상도별 배너 이미지 사이즈

  //최초 상태
  bannerClass.css("opacity", "0"); //전체 배너 노출 x
  $(bannerEachClass + cnt)
    .css("opacity", "1")
    .css("left", "0"); //첫번째 배너 노출

  bannerImgClass.css("width", bannerImgSize); //첫 화면 배너 이미지 사이즈 (이미지 크기에 따라 배너 사이즈 변경)
  dockBar.css("width", barLength); //첫 배너 bar길이

  //배너 자동 재생
  // var timeOnOff; //타이머
  var onoff = true; // true=타이머 동작중 , false=타이머 동작중지
  function autoMove() {
    cnt++; //카운트 1씩 증가

    bannerClass.css("opacity", "0").css("left", "0"); //전체 배너 노출 x
    $(bannerEachClass + cnt)
      .css("opacity", "1")
      .css("left", -(bannerImgSize * (cnt - 1))); //관계 있는 배너만 노출

    dockBar.css("width", barLength * cnt); //관계있는 배너 bar길이

    if (cnt == bannerCnt) cnt = 0;
  }

  timeOnOff = setInterval(autoMove, 2500);

  //실시간 배너이미지 사이즈 변경
  $(window).resize(function () {
    var bannerLiveSize = $(window).width(); //실시간 배너 이미지

    $(bannerImgClass).css("width", bannerLiveSize); //실시간 배너 이미지 사이즈 적용
  });

  //stop/play 버튼 클릭시 타이머 동작/중지
  $(".visual .dock-btn").click(function () {
    if (onoff == true) {
      // 타이머가 동작 유무
      clearInterval(timeOnOff); // 정보 처리 stop버튼 클릭시
      $(".visual .dock-btn--auto").css("display", "inline-block");
      $(".visual .dock-btn--pause").css("display", "none"); // js파일에서는 경로의 기준 html파일 기준
      onoff = false;
    } else {
      // false 타이머가 중지 상태 유무
      timeOnOff = setInterval(autoMove, 4000); //play버튼 클릭시 타이머 부활
      $(barBtn + "auto").css("display", "none");
      $(barBtn + "pause").css("display", "inline-block");
      onoff = true;
    }
  });
});

//slide
$(function () {
  //slide class 변수
  var slideBox = $(".slide-box");
  var slideList = slideBox.find(".slide");
  var slideItem = slideList.find(".slide__item");

  var slideIdx = 0; //슬라이드 처음 시작점
  var slideWidth = 464; //슬라이드 아이템 width
  var slideGap = 24; //슬라이드 아이템 간격

  var slideCnt = slideItem.length; //아이템 요소 갯수
  var itemMov = slideWidth + slideGap; //슬라이드 이동 거리 계산

  var newSlideWidth; //clone된 슬라이드 width

  var btn = slideBox.find(".direction-btn");
  var prevBtn = slideBox.find(".direction-btn--left"); //왼쪽 버튼
  var nextBtn = slideBox.find(".direction-btn--right"); //오른쪽 버튼

  var dockBar = slideBox.find(".dock-bar__stage");
  var barLength = 420 / slideItem.length; //bar 길이 (전체 dock-bar길이 / 배너 수)

  var dockBtn = slideBox.find(".dock-btn"); //재생/일시정지버튼
  var dockBtnPause = slideBox.find(".dock-btn--pause"); //일시정지버튼
  var dockBtnAuto = slideBox.find(".dock-btn--auto"); //재생버튼

  newSlideWidth = slideWidth; //복사한 슬라이드 배열 길이 = 기존 슬라이드 배열 길이

  //복사본 생성 및 앞/뒤에 추가
  slideList.css({ gap: slideGap + "px" }); //슬라이드 간격 추가
  slideList.prepend(slideItem.clone().addClass("clone")); //앞
  slideList.append(slideItem.clone().addClass("clone")); //뒤

  //중앙 정렬
  function centerSlide() {
    var fullSlide = -itemMov * slideCnt + "px"; // -슬라이드 움직이는 거리 * 아이템 요소 갯수
    slideList.css({ transform: "translateX(" + fullSlide + ")" });
  }
  centerSlide();
  $(dockBar).css("width", barLength).addClass("ani-strok"); //첫 배너 bar길이

  //자동 슬라이드
  var timer2 = undefined;
  var onoff2 = true;

  function autoSlide() {
    if (timer2 == undefined) {
      timer2 = setInterval(function () {
        slideBtn(slideIdx + 1);
      }, 1500);
    }
  }
  autoSlide();

  function stopSlide() {
    clearInterval(timer2);
    timer2 = undefined;
  }

  dockBtn.click(function (e) {
    e.preventDefault();
    if ($(this).is(dockBtnPause)) {
      stopSlide();
      dockBtnAuto.css("display", "inline-block");
      dockBtnPause.css("display", "none"); // js파일에서는 경로의 기준 html파일 기준
    } else if ($(this).is(dockBtnAuto)) {
      autoSlide();
      dockBtnPause.css("display", "inline-block");
      dockBtnAuto.css("display", "none"); // js파일에서는 경로의 기준 html파일 기준
    }
  });

  //좌우 슬라이드 버튼
  btn.click(function (e) {
    e.preventDefault();
    stopSlide();
    dockBtnAuto.css("display", "inline-block");
    dockBtnPause.css("display", "none"); // js파일에서는 경로의 기준 html파일 기준
    if ($(this).is(nextBtn)) {
      slideBtn(slideIdx + 1); //슬라이드 시작점 + 1
    } else if ($(this).is(prevBtn)) {
      slideBtn(slideIdx - 1); //슬라이드 시작점 - 1
    }
  });

  //슬라이드 이동
  function slideBtn(num) {
    //아이템 이동거리 * -슬라이드num
    if (slideIdx == slideCnt || slideIdx == -slideCnt) {
      //마지막 슬라이드 일 때(초기화)
      slideList.css({ left: "0px" }); //ul 처음 위치로 보내기
      slideIdx = 0; //슬라이드 시작점 초기화
    } else {
      slideList.stop().animate({ left: itemMov * -num + "px" }, 300); //-(아이템*num)만큼 이동
      slideIdx = num;

      //바 길이
      $(dockBar)
        .css("width", barLength * (slideIdx + 1))
        .addClass("ani-strok"); //배너 bar길이
      if (slideIdx < 0) {
        $(dockBar)
          .css("width", barLength * (slideIdx + slideCnt + 1)) //-1+6
          .addClass("ani-strok"); //배너 bar길이
      }
      if (slideIdx == slideCnt || slideIdx == -slideCnt) {
        $(dockBar).css("width", barLength).addClass("ani-strok"); //첫 배너 bar길이
      }
    }
  }
});
