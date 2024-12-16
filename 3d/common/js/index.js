// 初期設定
import NavColorChanger from "./module/navcolorchanger.js"; //ナビゲーションの色変化
import Parapara from "./module/parapara.js"; //スクロールアニメーション
import LoadImages from "./module/imagesloaded.js"; //画像オブジェクト
// import ShuffleText from "./module/shuffle-text.module.js";
class Application {
  start() {
    let imageSets;
    // 画像ロードに渡すオブジェクト
    if (window.matchMedia("(max-width:767px)").matches) {
      // 767px以下

      imageSets = [
        {
          id: 1,
          startNum: 15,
          endNum: 330,
          totalSheet: 316,
          path: "./common/img/3d/sp_pc/NotePC_"
        },
        {
          id: 2,
          startNum: 0,
          endNum: 200, // 210が終了のところを早めに切り上げる
          totalSheet: 211,
          path: "./common/img/3d/sp_mobile/Mobile_"
        }
      ];
    } else if (window.matchMedia("(min-width:768px)").matches) {
      // 768px以上(pc)
      imageSets = [
        {
          id: 1,
          startNum: 15,
          endNum: 330,
          totalSheet: 316,
          path: "./common/img/3d/pc_pc/NotePC_"
        },
        {
          id: 2,
          startNum: 0,
          endNum: 210, // 210が終了のところを早めに切り上げる
          totalSheet: 211,
          path: "./common/img/3d/pc_mobile/Mobile_"
        }
      ];
    }
    // インスタンスを作成して画像をロード
    const loader = new LoadImages(imageSets);

    loader.load();
    this.addEventListener(loader.getAll(1), loader.getAll(2));
  }

  /**
   * 各イベントリスナの設定
   *
   */
  addEventListener(images1, images2) {
    /**
     * section1
     * 【Note PC】
     * ・15 ～ 43
     * ・44 ～ 105
     * ・106 ～ 151
     * ・152 ～ 232
     * ・233 ～ 268
     */
    /** 高さを設定する要素 */
    const sec_height_el_1 = document.querySelector(".js_anime01_height");
    /** 画像がを切り替える要素 */
    const frame_el_1 = document.querySelector(".js_anime01_frame");
    /** 1スクロールに対する画像切替枚数 PC */
    // const speed1 = [29, 62, 46, 81, 36];
    const speed1 = [36, 77, 57, 100, 45];
    const parapara1 = new Parapara(
      1, //オブジェクトid
      15, //最初の画像番号
      330, //最後の画像番号
      316, //合計画像枚数
      speed1, //1スクロールに対する画像切替枚数計算用
      -200, //指定ピクセル分画像のアニメーション開始を早める
      false, //最後までしっかりスクロールしきるか
      frame_el_1, //canvasを設置する要素
      sec_height_el_1, //アニメーション中にstickyするための高さを確保する親要素（frame_elの親要素）
      1300, //画像切り替えのためのスクロール量の閾値
      images1
    );
    parapara1.SetParapara();

    /**
     * section2
     * 【Mobile】
     * ・15 ～ 48
     * ・49 ～ 84
     * ・85 ～ 115
     * ・116 ～145
     */
    /** 高さを設定する要素 */
    const sec_height_el_2 = document.querySelector(".js_anime02_height");
    /** 画像がを切り替える要素 */
    const frame_el_2 = document.querySelector(".js_anime02_frame");
    /** 1スクロールに対する画像切替量の数値 SP */
    // const speed2 = [34, 36, 31, 30];
    const speed2 = [59, 62, 54, 24]; // 210が終了のところを早めに切り上げる
    const parapara2 = new Parapara(
      2, //オブジェクトid
      0, //最初の画像番号
      200, //最後の画像番号 210が終了のところを早めに切り上げる
      211, //合計画像枚数
      speed2, //1スクロールに対する画像切替枚数計算用
      -200, //指定ピクセル分画像のアニメーション開始を早める
      true, //最後までしっかりスクロールしきるか
      frame_el_2, //canvasを設置する要素
      sec_height_el_2, //アニメーション中にstickyするための高さを確保する親要素（frame_elの親要素）
      1300, //画像切り替えのためのスクロール量の閾値
      images2
    );
    parapara2.SetParapara();

    /**
     * ハンバーガー
     */
    const ham_el = document.querySelector(".js_hamBtn");
    const gnav_el = document.querySelector(".js_gnav");
    const contact = document.querySelector(".js_contact");
    function openNav() {
      // ハンバーガー開く
      gnav_el.classList.add("Open");
      // ハンバーガーボタンにクラス付与
      ham_el.classList.add("Open");
    }
    function closeNav() {
      //ハンバーガー閉じる
      gnav_el.classList.remove("Open");
      // ハンバーガーボタンのクラス削除
      ham_el.classList.remove("Open");
    }
    /** ハンバーガーボタンクリック */
    ham_el.onclick = function () {
      if (gnav_el.classList.contains("Open")) {
        closeNav();
      } else {
        openNav();
      }
    };

    /**
     * お問い合わせ表示
     */
    const showContactBtn = document.querySelectorAll(".js_show_contact");
    showContactBtn.forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault(); // デフォルトのアンカーリンク動作を防止

        // ページの高さを取得
        const pageHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );

        // ページの最下部にスクロール
        window.scrollTo({
          top: pageHeight,
          behavior: "instant"
        });

        // ナビゲーションを閉じる（closeNav関数が定義されていると仮定）
        if (typeof closeNav === "function") {
          closeNav();
        }

        // コンタクトセクションを表示（必要に応じて）
        const contactSection = document.querySelector("#Contact");
        if (contactSection) {
          contactSection.classList.add("show");
        }
      };
    });

    /**
     * ナビゲーション色変更
     */
    const sections = document.querySelectorAll(".js_section");
    const navHeight = gnav_el.offsetHeight;
    const navColorChanger = new NavColorChanger(
      gnav_el,
      sections,
      navHeight,
      contact
    );
    window.addEventListener("scroll", () => navColorChanger.updateNavColor());
    navColorChanger.updateNavColor(); // 初期表示時にも実行

    /**
     * リロードで画面のスクロールを一番上に戻す
     * リロードすると１ページ目に戻るため、２ページ目でスクロールしていても一番上に戻す
     */
    window.addEventListener("unload", e => {
      window.scroll({
        top: 0,
        behavior: "instant" //アニメーションしない
      });
    });
  }
}

/**
 * 必ずstylesheetのロード後にjavascriptを読み込む
 */
window.addEventListener("load", () => {
  const stylesheet = document.getElementById("js_stylesheet");
  if (stylesheet) {
    stylesheet.onload = function () {
      // console.info("Specific CSS is fully loaded.");
      const app = new Application();
      app.start();

      const topEnd = gsap.timeline({
        scrollTrigger: {
          trigger: ".js_sec_ttl",
          start: "top top",
          end: "center center",
          scrub: 2.5
        }
      });
      topEnd
        .fromTo(
          ".js_sec_ttl .-top",
          {
            yPercent: -300,
            opacity: 0
          },
          {
            yPercent: 0,
            opacity: 1
          }
        )
        .fromTo(
          ".js_sec_ttl .-bottom",
          {
            yPercent: -220,
            opacity: 0
          },
          {
            yPercent: 0,
            opacity: 1
          },
          "<"
        );

      const topEnd2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".js_sec_ttl2",
          start: "top top",
          end: "center center",
          scrub: 2.5
        }
      });
      topEnd2
        .fromTo(
          ".js_sec_ttl2 .-top",
          {
            yPercent: -200,
            opacity: 0
          },
          {
            yPercent: 0,
            opacity: 1
          }
        )
        .fromTo(
          ".js_sec_ttl2 .-bottom",
          {
            yPercent: -220
          },
          {
            yPercent: 0
          },
          "<"
        );
    };

    // フォールバック: すでに読み込まれている場合
    if (stylesheet.sheet) {
      stylesheet.onload();
    }
  } else {
    // console.error("Stylesheet link element not found.");
  }
});
