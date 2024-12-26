import readline from 'readline'
export default function dispress(progress,msg) {
    // 現在の行をクリアしてカーソルを左端に移動
    readline.moveCursor(process.stdout, -process.stdout.columns, 1);

    readline.clearLine(process.stdout, 0);
    process.stdout.write(`${msg} ${progress}%`);
  }