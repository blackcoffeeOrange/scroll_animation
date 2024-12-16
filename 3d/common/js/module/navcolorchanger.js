//スクロールによって変わる背景色に合わせてナビゲーションの色を変化

/**
 * スクロール量を監視してセクションに合わせてターゲットを色変化
 */
export default class NavColorChanger {
  constructor(nav, sections, navHeight, contact) {
    this.nav = nav;
    this.sections = sections;
    this.navHeight = navHeight;
    this.contact = contact;
    this.updateNavColor = this.updateNavColor.bind(this);
  }
  updateNavColor() {
    if (this.contact && this.contact.classList.contains("show")) {
      //お問い合わせセクションのみ適用
      this.nav.classList.add("White");
      return;
    }
    const scrollPosition = window.scrollY;
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const backgroundColor =
          window.getComputedStyle(section).backgroundColor;
        this.getContrastColor(backgroundColor, section);
        // this.nav.style.color = navColor[0];
      }
    });
  }
  getContrastColor(bgColor, section) {
    let bgcolor = section.dataset.bgcolor;
    if (bgcolor == "bk") {
      // ナビゲーションのカラー
      this.nav.classList.remove("Black");
      this.nav.classList.add("White");
    }
    if (bgcolor == "wh") {
      this.nav.classList.add("Black");
      this.nav.classList.remove("White");
    }
    return bgcolor;
  }
}
