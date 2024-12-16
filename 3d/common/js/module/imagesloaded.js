import ShuffleText from "./shuffle-text.module.js";
export default class LoadImages {
  totalImages = 0; // 全画像数
  loadedImages = 0; // 読み込まれた画像数
  path;
  startNum;
  Loader;
  progressBar;
  tmp = {};
  constructor(imageSets) {
    // imageSetsは複数の画像セットの配列
    this.imageSets = imageSets;
    this.Loader = document.querySelector(".js_Loader");
    this.progressBar = document.querySelector(".loader_progress");

    // 各画像セットのIDで画像を管理するためのオブジェクトを初期化
    this.imageSets.forEach(({ id, startNum, totalSheet, path }) => {
      this.tmp[id] = {};
      this.startNum = startNum;
      this.totalImages += totalSheet; // 全画像数を加算
      this.path = path;
    });
  }
  // 画像のロードと画像名と番号の割り振り
  load() {
    this.effect().start();
    /**
     * <img>グローバルオブジェクト
     */
    /**
     *  画像のロード数をカウントします。
     *  プログレスバーに渡します。
     */
    this.imageSets.forEach(({ id, startNum, totalSheet, path }) => {
      for (let i = 0; i <= totalSheet - 1; i++) {
        const _i = i + startNum;
        var img = new Image();
        img.src = path + _i + ".png";
        this.tmp[id][_i] = img;
        // console.log("_i ", _i); // 15
        // console.log("img.src ", img.src);// 15
        // console.log("this.tmp[id][_i]", this.tmp[id][_i]); // 15
        img.onload = e => {
          this.loadedImages++;
          this.updateProgress();
        };
        img.onerror = e => {
          console.error("画像の読み込み中にエラーが発生しました", e);
        };
      }
    });

    return this.tmp;
  }
  /**
   *
   * @param {number} id インスタンスid
   * @param {number} Loader
   * @param {number} progressBar
   * @param {number} imgLoadedNum 呼び出し時点で読み込み済み画像枚数
   * @param {number} progressSpeed プログレスバーの進むスピード 大きいほど速くなる
   * @param {number} progressRate
   * @param {number} progressResult
   */
  updateProgress() {
    document.querySelector("body").classList.add("loading");

    const progressRate = (this.loadedImages / this.totalImages) * 100;
    // console.log("読み込み率", progressRate);
    this.progressBar.style.width = `${progressRate}%`;

    if (progressRate >= 100) {
      //読み込み終わり
      // console.log("images loaded.", this.tmp);
      setTimeout(() => {
        this.effect().stop();
        document.querySelector("body").classList.remove("loading");
        document.querySelector("body").classList.add("is_loaded");
        this.Loader.classList.add("is_loaded");
      }, 800);
    }
  }
  effect() {
    const glitch_Nodes = document.querySelectorAll(".js_glitch");
    // const shuffleText_Nodes = document.querySelectorAll(".js_shuffleText");
    // let shuffleIntervalId;
    // console.log("shuffleIntervalId", shuffleIntervalId);
    function start() {
      glitch_Nodes.forEach(function (Node) {
        Node.classList.add("on");
      });
      // shuffleText_Nodes.forEach(function (Node) {
      //   const shuffleText = new ShuffleText(Node);
      //   shuffleInterval(shuffleText);
      // });
    }
    function stop() {
      glitch_Nodes.forEach(function (Node) {
        // glitchエフェクト終わり
        Node.classList.remove("on");
      });
      // shuffleText_Nodes.forEach(function (Node) {
      //   const shuffleText = new ShuffleText(Node);
      //   shuffleText.stop();
      //   shuffleText.dispose();
      //   console.log("ストップ")
      // });
      // clearInterval(shuffleIntervalId);
      // // setIntervalを停止
      // if (shuffleIntervalId) {
      //   shuffleIntervalId = null;
      // }
    }

    function shuffleInterval(text) {
      function startShuffle() {
        shuffleIntervalId = setInterval(() => {
          text.start(); // テキストシャッフルの開始
        }, 100);
        console.log(shuffleIntervalId);
        // 2秒後にシャッフルを停止し、さらに2秒後に再開
        setTimeout(() => {
          clearInterval(shuffleIntervalId); // シャッフルを停止
          shuffleIntervalId = null;

          // 2秒後に再度シャッフルを開始
          setTimeout(startShuffle, 2000);
        }, 2000);
      }

      startShuffle(); // 最初にシャッフルを開始
    }
    // /**
    //  * shuffleText
    //  */
    // let interval_id;
    // shuffleText_Nodes.forEach(function (Node) {
    //   const shuffleText = new ShuffleText(Node);
    //   // interval_id = shuffleSet(shuffleText);
    //   shuffleText.start();
    //   // if (progressRate >= 100) {
    //     // console.log("おわり", interval_id);
    //     // console.log("おわり", shuffleText);
    //     // clearInterval(interval_id);
    //     shuffleText.stop();
    //     shuffleText.dispose();
    //     // shuffuleRemove(interval_id, shuffleText);
    //   } else {
    //     console.log("おわらない");
    //     // clearInterval(interval_id);
    //   }
    // });

    return {
      start: start,
      stop: stop
    };
  }

  /**
   * 指定されたIDの全ての画像を取得する
   * @param {number} imageId 画像のID
   * @returns {HTMLImageElement[]} 画像オブジェクトの配列
   */
  getAll(imageId) {
    if (!this.tmp[imageId]) {
      console.error(`ID ${imageId} の画像は存在しません。`);
      return [];
    }
    return this.tmp[imageId];
  }
}
