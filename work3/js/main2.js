// JavaScript Document

//visual
$(function () {
  var dockBar = ".visual .dock-bar__stage"; //배너 순서 별 bar 길이
  var bannerClass = ".visual .container"; //배너 class
  var bannerEachClass = ".visual .container--0"; //각 배너 class
  var bannerImgClass = ".visual .main-image"; //배너 이미지 class

  var barLength = "210"; //bar 길이 (전체 dock-bar길이 / 배너 수)
  var barBtn = ".visual .dock-btn--"; //재생 버튼 auto,pause로 구분

  var bannerCnt = 2; //배너 수
  var cnt = 1; //최초 배너 순서
  var timeOnOff; //타이머
  var onoff = true; // true=타이머 동작중 , false=타이머 동작중지

  var bannerImgSize = $(window).width(); //해상도별 배너 이미지 사이즈

  //최초 상태
  $(bannerClass).css("opacity", "0"); //전체 배너 노출 x
  $(bannerEachClass + cnt)
    .css("opacity", "1")
    .css("left", "0"); //첫번째 배너 노출

  $(bannerImgClass).css("width", bannerImgSize); //첫 화면 배너 이미지 사이즈 (이미지 크기에 따라 배너 사이즈 변경)
  $(dockBar).css("width", barLength).addClass("ani-strok"); //첫 배너 bar길이

  //배너 자동 재생
  function autoMove() {
    cnt++; //카운트 1씩 증가

    $(bannerClass).css("opacity", "0").css("left", "0"); //전체 배너 노출 x
    $(bannerEachClass + cnt)
      .css("opacity", "1")
      .css("left", -(bannerImgSize * (cnt - 1))); //관계 있는 배너만 노출

    $(dockBar)
      .css("width", barLength * cnt)
      .addClass("ani-strok"); //관계있는 배너 bar길이

    if (cnt == bannerCnt) cnt = 0;
  }

  timeOnOff = setInterval(autoMove, 4000);

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
var slideBox = $(".slide-box");
var slideList = slideBox.find(".slide");
var slideItem = slideList.find(".slide__item");

var slideIdx = 0; //슬라이드 시작점
var slideCnt = slideItem.length; //슬라이드 배열 길이
var slideWidth = 464; //슬라이드 아이템 width
var slideGap = 24; //슬라이드 아이템 간격
var itemMov = slideWidth + slideGap; //슬라이드 아이템 움직이는 거리 계산
var maxSilde = 3;
var responsiveMargin = 20;
var newSlideList;
var newSlideWidth;
var prevBtn = slideBox.find(".direction-btn--left");
var nextBtn = slideBox.find(".direction-btn--right");

newSlideWidth = slideWidth; //복사한 슬라이드 배열 길이 = 기존 슬라이드 배열 길이

//복사본 생성 및 앞/뒤에 추가
slideList.css({ gap: slideGap + "px" });
slideList.prepend(slideItem.clone().addClass("clone")); //앞
slideList.append(slideItem.clone().addClass("clone")); //뒤

//가로 배열
function slideWrap(sw, sg) {
  newSlideList = $(".slide li");
  itemMov = sw + sg;

  newSlideList.each(function (idx) {
    $(this).css({ flexBasis: sw + "px" });
  });
}
slideWrap(slideWidth, slideGap);

//중앙 정렬
function centerSlide() {
  var fullSlide = -itemMov * slideCnt + "px";
  slideList.css({ transform: "translateX(" + fullSlide + ")" });
}
centerSlide();

//좌우 슬라이드 버튼
nextBtn.click(function () {
  itemMov(slideIdx + 1);
});
prevBtn.click(function () {
  itemMov(slideIdx - 1);
});

//슬라이드 이동
function slideMov(num) {
  slideList.stop().animate({ left: itemMov * num + "px" }, 500, function () {
    if (slideIdx == slideCnt || slideIdx == -(-slideCnt)) {
      slideList.css({ left: "0px" });
      slideIdx = 0;
    }
  });
}
