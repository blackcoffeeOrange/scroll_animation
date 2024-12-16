/**
 * スクロールアニメーション
 * imageloadesでセットした画像をスクロール量で切り替えてパラパラアニメーション
 * アニメーションごとにインスタンスを生成する
 */
export default class Parapara {
  constructor(
    id, //オブジェクトid
    startNum, //最初の画像番号
    endNum, //最後の画像番号
    totalSheet, //合計画像枚数
    speed,
    delay, //指定ピクセル分画像のアニメーション開始を早める
    toend, //最後までしっかりスクロールしきるか
    frame_el, //canvasを設置する要素
    sec_height_el, //アニメーション中にstickyするための高さを確保する親要素（frame_elの親要素）
    scrollThreshold, //画像切り替えのためのスクロール量の閾値
    tmp
  ) {
    this.id = id;
    this.startNum = startNum;
    this.endNum = endNum;
    this.totalSheet = totalSheet;
    this.speed = speed;
    this.delay = delay;
    this.toend = toend;
    this.frame_el = frame_el;
    this.sec_height_el = sec_height_el;
    this.scrollThreshold = scrollThreshold;
    this.tmp = tmp;
    this.AnimationObj = {};
    this.step = {};
  }

  /**
   * 画像切替スクロールイベントリスナの登録
   */
  SetParapara() {
    /** canvas要素を一つ生成 */
    const canvas = document.createElement("canvas");
    this.context = canvas.getContext("2d");
    // キャンバスサイズと比率の設定(画像サイズではなくあくまでも比率)
    if (window.matchMedia("(max-width: 767px)").matches) {
      //sp
      canvas.width = 1284;
      canvas.height = 2001;
    } else if (window.matchMedia("(min-width:768px)").matches) {
      //pc
      canvas.width = 1920;
      canvas.height = 1080;
    }

    /** canvasを設置 */
    this.frame_el.appendChild(canvas);
    this.frame_el_top = this.frame_el.getBoundingClientRect().top;
    // アニメーションするスクロール領域の高さを設定
    let totalScrollHeight;
    // スクロール全体の高さを計算
    if (this.toend) {
      //最後までアニメーションしきってからあがる
      totalScrollHeight =
        this.speed.length * this.scrollThreshold +
        this.scrollThreshold -
        this.delay;
    } else {
      //最後までアニメーションしきらずに上に上がっていく
      totalScrollHeight = this.speed.length * this.scrollThreshold - this.delay;
    }
    this.sec_height_el.style.height = totalScrollHeight + "px"; // sec_height_elに高さを設定
    /** 1スクロールの範囲にする閾値 */
    let scrollThreshold = this.scrollThreshold;
    /** 画像切替スピード */
    let speed = this.speed;
    // オブジェクトの生成

    let step = 0;
    Object.keys(this.speed).forEach((key, index) => {
      this.AnimationObj[key] = {
        sheet: speed[key], //切替画像数
        duration: this.scrollThreshold / speed[key], //1スクロール中（1000px）に1枚の画像の表示時間（px）を割り当てるか
        scroll: scrollThreshold * (index + 1), //何段階目か
        step: speed[key] + step
      };
      step += speed[key];
    });

    // console.log("AnimationObj", this.AnimationObj);
    // スクロールイベントリスナー
    window.addEventListener("scroll", this.scrollObserver.bind(this), false);
  }

  /**
   * scroll量の監視をして
   * 画像切替エリアの範囲に入っていたら
   * 画像切替関数呼び出し
   */
  scrollObserver() {
    let fireflag = false;
    /**
     *
     * エリアに入ってからのスクロール量 遅延数を計算に入れる
     * 0でアニメーション呼び出し
     * （bodyのスクロール量 - stickyする要素のbody内でのtop位置（0でビューポートのtop位置を過ぎる(発火タイミング)））+ 遅延px（-値pxで発火タイミングを遅らせる）;
     */
    let inner_scrollY;
    if (this.delay) {
      inner_scrollY =
        Math.floor(window.scrollY - this.frame_el_top) + this.delay;

      if (this.toend) {
        //遅延があるとき&&最後までアニメーションしきってからあがる
        inner_scrollY = Math.floor(window.scrollY - this.frame_el_top);
      } else {
        inner_scrollY = Math.floor(window.scrollY - this.frame_el_top);
      }
    } else {
      inner_scrollY = Math.floor(window.scrollY - this.frame_el_top);
    }
    /**
     * スクロールエリアに入ったら画像切替関数を呼び出す
     **/
    if (inner_scrollY > 0) {
      fireflag = true;
    } else {
      fireflag = false;
    }
    //画像切替する
    if (fireflag) {
      for (let key in this.AnimationObj) {
        key = Number(key);
        if (
          inner_scrollY >
            this.AnimationObj[key].scroll - this.scrollThreshold &&
          inner_scrollY < this.AnimationObj[key].scroll
        ) {
          /**
           * this.AnimationObj[key].scrollが1000のとき、
           * 条件に合致しない場合は、inner_scrollY が 0 以下 または 1000 以上 のときです。
           * this.AnimationObj[key].scrollが2000のとき、
           * 条件に合致しない場合は、inner_scrollY が 1000 以下 または 2000 以上 のときです。
           * this.AnimationObj[key].scrollが3000のとき、
           * 条件に合致しない場合は、inner_scrollY が 2000 以下 または 3000 以上 のときです。
           * this.AnimationObj[key].scrollが3000のとき、
           * 条件に合致しない場合は、inner_scrollY が 3000 以下 または 4000 以上 のときです。
           * inner_scrollYが2400だとしたら、ループするif文の上記のうちの合致しない条件は、
           * 1000以上のとき、2000以上の時になるので2000番代はelseに分岐され、次のループで2000と3000の間で条件が合致してbrake。
           *
           */

          this.animation(key, inner_scrollY);

          break;
        }
      }
    }
  }

  /**
   * スクロールを監視しているscrollObserverの中で、
   * アニメーションエリアにいる最中は常に呼び出されている
   * アニメ箇所stickyでスクロール
   *
   * @todo pcの設定によってマウスの１ホイールのスクロールピクセル量は変わる
   *
   *
   */
  animation(key, inner_scrollY) {
    /**
     * 今どの段階にいるか調べて画像の番号を取得
     */
    let sheetNum = 0;
    // AnimationObj をループして処理
    for (let animKey in this.AnimationObj) {
      let animObj = this.AnimationObj[animKey];
      let prevScroll = animKey > 0 ? this.AnimationObj[animKey - 1].scroll : 0;
      let prevStep = animKey > 0 ? this.AnimationObj[animKey - 1].step : 0;

      // 現在のスクロール位置がこのアニメーションの範囲にいるかを確認
      if (inner_scrollY > prevScroll && inner_scrollY <= animObj.scroll) {
        // 画像番号を連続させるため、前のステップを考慮して計算
        sheetNum =
          prevStep +
          Math.floor((inner_scrollY - prevScroll) / animObj.duration) +
          this.startNum;

        break; // 該当する範囲が見つかったらループを抜ける
      }
    }
    // console.log("inner_scrollY", inner_scrollY);
    // console.log("sheetNum", sheetNum);
    //スマホ画像のセクションのみ

    if (this.id == 2 && sheetNum >= this.endNum - 10) {
      window.document.querySelector(".js_contact").classList.add("show");
    } else if (this.id == 2 && sheetNum <= this.endNum) {
      window.document.querySelector(".js_contact").classList.remove("show");
    }
    /** 画像表示 */
    if (window.matchMedia("(max-width: 767px)").matches) {
      this.context.clearRect(0, 0, 1284, 2001);
      this.context.fillStyle = "#ffffff";
      this.context.drawImage(this.tmp[sheetNum], 0, 0, 1284, 2001);
    } else if (window.matchMedia("(min-width:768px)").matches) {
      this.context.clearRect(0, 0, 1920, 1080);
      this.context.fillStyle = "#ffffff";
      this.context.drawImage(this.tmp[sheetNum], 0, 0, 1920, 1080);
    }
  }
}
