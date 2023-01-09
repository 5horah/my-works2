// JavaScript Document

//visual
$(function () {});

//slide
//slide class 변수
var slideBox = $(".slide-box");
var slideList = slideBox.find(".slide");
var slideItem = slideList.find(".slide__item");

var slideIdx = 0; //슬라이드 처음 시작점
var slideCnt = slideItem.length; //아이템 요소 갯수
var slideWidth = 464; //슬라이드 아이템 width
var slideGap = 24; //슬라이드 아이템 간격
var itemMov = slideWidth + slideGap; //슬라이드 이동 거리 계산
var maxSilde = 3; //총 슬라이드
var responsiveMargin = 20;
var newSlideList; //clone된 슬라이드
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
