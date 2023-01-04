// JavaScript Document

//visual
$(document).ready(function () {
  //visual

  var timeonoff; //타이머 처리
  var imageCount = 2; //이미지 총개수
  var cnt = 1; //이미지 순서 1 2 3 4 5 1 2 3 4 5....(현재 이미지 순서)
  var onoff = true; // true=타이머 동작중 , false=타이머 동작중지

  var barLength = "210"; //전체 bar 길이 / cnt

  $(".visual .dock-bar__stage").css("width", barLength).addClass("ani-strok"); // 첫번째 dock 버튼 너비 증가

  $(".visual .container").hide(); //모든 이미지를 보이지 않게 처리
  $(".visual .container--01").fadeIn("slow"); //첫번째 이미지 노출

  function moveg() {
    cnt++; //카운트 1씩 증가, 5(마지막)일 경우 다시 초기화 0  1 2 3 4 5 1 2 3 4 5

    $(".visual .container").hide(); //모든 이미지를 보이지 않게 처리
    $(".visual .container--0" + cnt).fadeIn("slow"); //자신과 관계있는 이미지만 노출

    $(".visual .dock-bar__stage")
      .css("width", barLength * cnt)
      .addClass("ani-strok"); // dock 버튼 원래 너비

    if (cnt == imageCount) cnt = 0; //카운트 초기화 0
  }

  timeonoff = setInterval(moveg, 4000); // 타이머를 동작 1~5이미지를 순서대로 자동 처리
  //var 변수 = setInterval( function(){처리코드} , 4000);  //정보를 담아놓는다
  //clearInterval(변수); -> 정보 처리역활

  //stop/play 버튼 클릭시 타이머 동작/중지
  $(".visual .dock-btn").click(function () {
    if (onoff == true) {
      // 타이머가 동작 유무
      clearInterval(timeonoff); // 정보 처리 stop버튼 클릭시
      $(".visual .dock-btn--auto").css("display", "inline-block");
      $(".visual .dock-btn--pause").css("display", "none"); // js파일에서는 경로의 기준 html파일 기준
      onoff = false;
    } else {
      // false 타이머가 중지 상태 유무
      timeonoff = setInterval(moveg, 4000); //play버튼 클릭시 타이머 부활
      $(".visual .dock-btn--auto").css("display", "none");
      $(".visual .dock-btn--pause").css("display", "inline-block");
      onoff = true;
    }
  });

  //왼쪽, 오른쪽 버튼
  $(".visual .direction-btn").click(function (event) {
    //각각의 버튼 클릭시
    var position = 0; //최초위치
    var movesize = $(window).width(); //이미지 하나의 너비(리뷰)
    var $target = $(event.target); //클릭한 버튼 $target == $(this)
    clearInterval(timeonoff); //타이머 중지

    $(".visual .container").fadeIn(); //모든 이미지를 보이게 처리

    if ($target.is(".visual .direction-btn--left")) {
      if (position == -(movesize * imageCount)) {
        $(".visual .container").css("left", 0);
        position = 0;
      }
    } else if ($target.is(".visual .direction-btn--right")) {
      if (position == 0) {
        $(".visual .container").css("left", -(movesize * imageCount));
        position = -(movesize * imageCount);
      }
      position += movesize;
      $(".visual .container")
        .stop()
        .animate(
          {
            left: position,
          },
          "fast",
          function () {
            // 포문 : 다음버튼 클릭했을 때 이미지 위치가 0일경우 옮겨주기
            if (position == 0) {
              $(".visual .container").css("left", -(movesize * imageCount));
              position = -(movesize * imageCount);
            }
          }
        );
    }

    // $(".visual .container--0" + cnt).fadeIn("slow"); //자기 자신 이미지만 노출

    // if (cnt == imageCount) cnt = 0; //카운트 초기화

    timeonoff = setInterval(moveg, 4000); //타이머 부활

    if (onoff == false) {
      //중지 상태 유무
      onoff = true; //동작
      $(".visual .dock-btn--pause").css("display", "inline-block");
      $(".visual .dock-btn--auto").css("display", "none");
    }
  });
});
