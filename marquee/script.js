// function Marquee(selector, speed) {
//   const parentSelector = document.querySelector(selector);
//   const clone = parentSelector.innerHTML;
//   const firstElement = parentSelector.children[0];
//   let i = 0;
//   console.log(firstElement);
//   parentSelector.insertAdjacentHTML("beforeend", clone);
//   parentSelector.insertAdjacentHTML("beforeend", clone);

//   setInterval(function () {
//     firstElement.style.marginLeft = `-${i}px`;
//     if (i > firstElement.clientWidth) {
//       i = 0;
//     }
//     i = i + speed;
//   }, 0);
// }

// //after window is completed load
// //1 class selector for marquee
// //2 marquee speed 0.2
// window.addEventListener("load", Marquee(".marquee", 0.2));

function marquee(a, b) {
  var width = b.width();
  var start_pos = a.width();
  var end_pos = -width;

  function scroll() {
    if (b.position().left <= -width) {
      b.css("left", start_pos);
      scroll();
    } else {
      time =
        (parseInt(b.position().left, 10) - end_pos) *
        (10000 / (start_pos - end_pos)); //we can increase or decrease speed by changing value 10000
      b.animate(
        {
          left: -width,
        },
        time,
        "linear",
        function () {
          scroll();
        }
      );
    }
  }

  b.css({
    width: width,
    left: start_pos,
  });
  scroll(a, b);
}

$(document).ready(function () {
  marquee($(".marquee"), $(".marquee-text")); //we need to add name of container element & marquee element
});
