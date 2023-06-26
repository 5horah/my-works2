let scrollTop = $(window).scrollTop();
let prevScrollTop = null;
let scrollDirection = null;

const header = {
  target: $(".layout-header"),
  revertClassName: "is-revert",
  hiddenClassName: "is-header-hidden",
  height: 0,
  init: function () {
    this.height = Math.round(this.target.outerHeight(), 10);
    this._revertColor();
    this.toggle();
  },
  update: function () {
    this.height = Math.round(this.target.outerHeight(), 10);
    this._revertColor();
    this.toggle();
  },
  onScroll: function () {
    this.update();
  },
  show: function () {
    $("body").removeClass(this.hiddenClassName);
  },
  hide: function () {
    $("body").addClass(this.hiddenClassName);
    this.onBottom();
  },
  toggle: function () {
    const offsetTop =
      Math.round($(".main-visual").outerHeight(), 10) - this.height;

    if (scrollDirection === "down") {
      if (scrollTop >= offsetTop + window.innerHeight) {
        this.hide();
      }
      this.onBottom();
    } else {
      this.show();
    }
  },
  onBottom: function () {
    const bottomY =
      $(document).height() - window.innerHeight - this.target.outerHeight();

    if (scrollTop >= bottomY) {
      this.show();
    }
  },
  _revertColor: function () {
    const offsetTop =
      Math.round($(".main-visual").outerHeight(), 10) - this.height;

    if (scrollTop >= offsetTop) {
      this.target.addClass(this.revertClassName);
    } else {
      this.target.removeClass(this.revertClassName);
    }
  },
};

const footer = {
  target: $(".layout-footer"),
  hiddenClassName: "is-hidden",
  init: function () {
    this.toggle();
  },
  update: function () {
    this.toggle();
  },
  show: function () {
    this.target.removeClass(this.hiddenClassName);
  },
  hide: function () {
    this.target.addClass(this.hiddenClassName);
    this.onBottom();
  },
  toggle: function () {
    if (scrollDirection === "down") {
      this.hide();
      this.onBottom();
    } else {
      this.show();
    }
  },
  onScroll: function () {
    this.toggle();
  },
  onBottom: function () {
    const bottomY =
      $(document).height() - window.innerHeight - this.target.outerHeight();

    if (scrollTop >= bottomY) {
      this.show();
    }
  },
};

const nav = {
  target: $(".main-menu"),
  items: $(".main-menu__list").find("li"),
  offsetY: 0,
  fixedClassName: "is-fixed",
  init: function () {
    const offsetY =
      Math.round($(".main-visual").outerHeight(), 10) -
      header.height -
      this.target.outerHeight();
    this.offsetY = offsetY;

    this.items.on("click", function () {
      $("html, body").stop().animate(
        {
          scrollTop: offsetY,
        },
        400
      );
    });
    this.toggleClass();
  },
  update: function () {
    const offsetY =
      Math.round($(".main-visual").outerHeight(), 10) -
      header.height -
      this.target.outerHeight();
    this.offsetY = offsetY;
    this.toggleClass();
  },
  onScroll: function () {
    this.toggleClass();
  },
  toggleClass: function () {
    if (scrollTop >= this.offsetY + this.target.outerHeight()) {
      this.target.addClass(this.fixedClassName);
    } else {
      this.target.removeClass(this.fixedClassName);
    }
  },
};

const visual = {
  target: $(".main-visual"),
  swiperSelector: ".main-visual__slider",
  controller: null,
  init: function () {
    this.controller = new Swiper(this.swiperSelector, {
      parallax: true,
      speed: 700,
      loop: true,
      pagination: {
        el: ".swiper-scrollbar",
        type: "progressbar",
      },
      autoplay: true,
      on: {
        slideChangeTransitionStart: function (swiper) {
          const activeIndex = swiper.realIndex + 1;
          $(".main-visual__pagination .current").text(activeIndex);
        },
      },
    });
  },
};

const deal = {
  target: $(".deal"),
  swiperSelector: ".deal__slider",
  controller: null,
  init: function () {
    this.controller = new Swiper(this.swiperSelector, {
      slidesPerView: "auto",
      spaceBetween: 3,
      freeMode: true,
    });
  },
};

$(document).ready(function () {
  header.init();
  // footer.init();
  visual.init();
  deal.init();
  nav.init();
});

$(window).on("load", function () {
  scrollTop = $(window).scrollTop();

  header.update();
  nav.update();
  // footer.update();

  prevScrollTop = scrollTop;
});

$(window).on("resize", function () {
  scrollTop = $(window).scrollTop();

  header.update();
  nav.update();
  // footer.update();

  prevScrollTop = scrollTop;
});

$(window).on("scroll", function () {
  scrollTop = $(window).scrollTop();

  if (scrollTop > prevScrollTop) {
    scrollDirection = "down";
  } else if (scrollTop < prevScrollTop) {
    scrollDirection = "up";
  }

  header.onScroll();
  // footer.onScroll();
  nav.onScroll();

  prevScrollTop = scrollTop;
});
