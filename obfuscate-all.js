import fs from "fs";
import path from "path";
import pkg from "javascript-obfuscator";

const { obfuscate } = pkg;

// 対象のディレクトリと出力先ディレクトリ
const targetDir = path.join(process.cwd(), "3d", "common", "js");
const outputDir = path.join(process.cwd(), "3d", "common", "build");

// 出力ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 再帰的にすべてのJSファイルを難読化
function obfuscateFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // サブディレクトリを再帰的に処理
      obfuscateFiles(fullPath);
    } else if (path.extname(fullPath) === ".js") {
      // JavaScriptファイルを読み込み難読化
      const code = fs.readFileSync(fullPath, "utf-8");
      const obfuscatedCode = obfuscate(code, {
        compact: true,
        controlFlowFlattening: true
      }).getObfuscatedCode();

      // 出力ファイルのパスを作成
      const outputFilePath = path.join(
        outputDir,
        path.relative(targetDir, fullPath)
      );

      // 出力ディレクトリに必要なサブディレクトリを作成
      const outputFileDir = path.dirname(outputFilePath);
      if (!fs.existsSync(outputFileDir)) {
        fs.mkdirSync(outputFileDir, { recursive: true });
      }

      // 難読化したコードを出力
      fs.writeFileSync(outputFilePath, obfuscatedCode);
      console.log(`Obfuscated: ${outputFilePath}`);
    }
  });
}

// 難読化処理を実行
obfuscateFiles(targetDir);
console.log("All JavaScript files have been obfuscated.");
