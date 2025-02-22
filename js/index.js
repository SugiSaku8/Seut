export default class Worker {
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
}

export class GuestWorker extends Worker {
  constructor(id, passport, program) {
    super(id, "Guest");
    this.passport = passport;
    this.priority = passport.priority;
    this.program = new Program(program);
    this.position = null;
  }

  async execute() {
    try {
      const result = await this.program.run();
      console.log(`Worker ${this.id} のプログラム実行完了: ${result}`);
      return result;
    } catch (error) {
      console.error(
        `Worker ${this.id} のプログラム実行エラー: ${error.message}`
      );
      throw error;
    }
  }
}

class Program {
  constructor(code) {
    this.code = this.validateCode(code);
    this.function = null;
  }

  validateCode(code) {
    // 危険な関数のチェック
    const dangerousFunctions = [
      "require",
      "import",
      "eval",
      "setTimeout",
      "setInterval",
    ];
    for (const func of dangerousFunctions) {
      if (code.includes(func)) {
        throw new Error(`危険な関数 '${func}' が検出されました`);
      }
    }
    return code;
  }

  createFunction() {
    // Functionコンストラクタを使用して安全にコードを実行
    this.function = new Function(`
            'use strict';
            const console = { log: function() {} };
            try {
                return (function() {
                    ${this.code}
                })();
            } catch (e) {
                throw new Error('プログラム実行エラー: ' + e.message);
            }
        `);
    return this.function;
  }

  async run() {
    if (!this.function) {
      this.createFunction();
    }
    return this.function();
  }
}

// パスポートシステム
class Passport {
  constructor(type, priority) {
    this.type = type;
    this.priority = priority;
    this.validated = false;
  }

  validate() {
    this.validated = true;
  }
}

class OneDayPassPort extends Passport {
  constructor(priority) {
    super("one-day", priority);
  }
}

// Forecourtクラスの定義
class Forecourt {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.priority = 10;
  }
}

// Park（ネットワーク）クラス
class Park {
  constructor(name, memorySize) {
    this.name = name;
    this.memorySize = memorySize;
    this.usedMemory = 0;
    this.guestWorkers = [];
    this.castWorkers = [];
    this.queues = [];
    this.initializeQueues(); // Queueを初期化
    this.headquarters = new HeadquartersCast(this);
    this.paradeLoot = new ParadeLoot(this);
    this.blocks = new Map();
    this.isRunning = false;
    this.isEnded = false;
  }

  initializeQueues() {
    for (let i = 0; i < 8; i++) {
      this.queues.push(new Queue(`Q${i + 1}`));
    }
  }

  async start() {
    if (this.isRunning) return;
    if (this.isEnded) throw new Error("パークは既に終了しています");
    this.isRunning = true;
    console.log(`${this.name} が開園しました`);
    await this.headquarters.start();
    await this.paradeLoot.start();
    this.headquarters.startBlockManagement();
  }

  async addGuestWorker(passport) {
    if (!this.isRunning || this.isEnded) {
      throw new Error("パークが稼働していません");
    }
    const worker = new GuestWorker(`guest-${Date.now()}`, passport, "");
    this.guestWorkers.push(worker);
    console.log(`新しいGuestWorkerが追加されました: ${worker.id}`);
    return worker;
  }

  async end() {
    if (!this.isRunning) {
      throw new Error("パークは稼働していません");
    }
    if (this.isEnded) {
      throw new Error("パークは既に終了しています");
    }

    console.log(`${this.name} の終了処理を開始します`);

    // ブロックの終了処理
    for (const [blockId, block] of this.blocks) {
      console.log(`ブロック ${blockId} の終了処理`);
      block.end();
    }

    // Queueのクリーンアップ
    this.queues.forEach((queue) => {
      console.log(`Queue ${queue.id} のクリーンアップ`);
      queue.cleanup();
    });

    // HeadquartersCastの終了
    await this.headquarters.end();

    // ParadeLootの終了
    await this.paradeLoot.end();

    this.isRunning = false;
    this.isEnded = true;
    console.log(`${this.name} が終了しました`);
  }
}

// HeadquartersCast（管理システム）
class HeadquartersCast {
  constructor(park) {
    this.park = park;
    this.memoryUsageHistory = [];
    this.signalHandlers = new Map();
    this.blockStatus = new Map();
    this.blockCount = 0;
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    // メモリ監視を開始
    this.startMemoryMonitoring();

    // Queue管理を開始
    this.startQueueManagement();
  }

  startMemoryMonitoring() {
    setInterval(() => {
      const currentUsage = this.calculateMemoryUsage();
      this.memoryUsageHistory.push({
        timestamp: Date.now(),
        usage: currentUsage,
      });

      if (this.shouldRestrictEntry()) {
        this.restrictNewEntries();
      }

      console.log(`メモリ使用量: ${currentUsage.toFixed(2)}%`);
    }, 1000);
  }

  calculateMemoryUsage() {
    return Math.random() * 80 + 10;
  }

  shouldRestrictEntry() {
    const recentUsage = this.memoryUsageHistory.slice(-120);
    const averageUsage =
      recentUsage.reduce((a, b) => a + b.usage, 0) / recentUsage.length;
    return averageUsage > 90;
  }

  restrictNewEntries() {
    console.log("メモリ使用量が高すぎます。新規入園を制限します。");
    this.saveMemoryState();
  }

  saveMemoryState() {
    const state = {
      timestamp: Date.now(),
      memoryUsage: this.memoryUsageHistory,
      activeWorkers: this.park.guestWorkers.length,
      queueSizes: this.park.queues.map((q) => q.size),
    };
    console.log("メモリ状態を保存しました:", JSON.stringify(state));
  }

  startQueueManagement() {
    setInterval(() => this.manageQueues(), 5000);
  }

  manageQueues() {
    this.park.queues.forEach((queue) => {
      if (queue.size <= 5) {
        this.mergeSmallQueues(queue);
      } else if (queue.size >= 64) {
        this.splitLargeQueues(queue);
      }
    });
  }

  mergeSmallQueues(sourceQueue) {
    const targetQueue = this.findOptimalMergeTarget(sourceQueue);
    if (targetQueue) {
      console.log(`Queue ${sourceQueue.id} を Queue ${targetQueue.id} に統合`);
      targetQueue.workers = [...targetQueue.workers, ...sourceQueue.workers];
      this.park.queues = this.park.queues.filter(
        (q) => q.id !== sourceQueue.id
      );
    }
  }

  splitLargeQueues(queue) {
    const newQueue = new Queue(this.generateQueueId());
    console.log(
      `Queue ${queue.id} を分割して新しい Queue ${newQueue.id} が作成されました`
    );
    const mid = Math.ceil(queue.workers.length / 2);
    newQueue.workers = queue.workers.slice(mid);
    queue.workers = queue.workers.slice(0, mid);
    this.park.queues.push(newQueue);
  }

  findOptimalMergeTarget(sourceQueue) {
    return this.park.queues.find((q) => q.id !== sourceQueue.id && q.size < 32);
  }

  generateQueueId() {
    let id = `Q${this.park.queues.length + 1}`;
    while (this.park.queues.some((q) => q.id === id)) {
      id = `Q${parseInt(id.slice(1)) + 1}`;
    }
    return id;
  }

  startBlockManagement() {
    // ブロックの自動作成を開始
    this.createInitialBlocks();
    // 定期的なブロック監視を開始
    setInterval(() => this.monitorBlocks(), 5000);
  }

  createInitialBlocks() {
    // 初期ブロックの作成
    for (let i = 0; i < 4; i++) {
      this.createBlock();
    }
  }

  createBlock() {
    const blockId = `B${++this.blockCount}`;
    const block = new Block(blockId);
    this.park.blocks.set(blockId, block);
    this.blockStatus.set(blockId, "operational");
    console.log(`新しいブロックが作成されました: ${blockId}`);
  }

  monitorBlocks() {
    // ブロックの状態を監視
    this.park.blocks.forEach((block, blockId) => {
      const status = block.checkStatus();
      if (status === "error") {
        this.handleBlockError(blockId);
      } else if (status === "recovered") {
        this.handleBlockRecovery(blockId);
      }
    });
  }

  handleBlockError(blockId) {
    console.log(`ブロック ${blockId} でエラーが発生しました (信号101)`);
    this.sendSignal(101, blockId);
    this.attemptRecovery(blockId);
  }

  handleBlockRecovery(blockId) {
    console.log(`ブロック ${blockId} が復旧しました (信号102)`);
    this.sendSignal(102, blockId);
  }

  sendSignal(signal, blockId) {
    console.log(`信号 ${signal} をブロードキャスト: ブロック ${blockId}`);
  }

  attemptRecovery(blockId) {
    console.log(`ブロック ${blockId} の復旧を試みます`);
  }

  async end() {
    this.isRunning = false;
    console.log("HeadquartersCastの終了処理を完了しました");
  }
}

// ParadeLootシステム
class ParadeLoot {
  constructor(park) {
    this.park = park;
    this.forecourt = new Forecourt();
    this.queues = [];
    this.currentPriority = 1;
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log("ParadeLootシステムが起動しました");
    await this.initializeQueues();
    this.startProcessing();
  }

  async initializeQueues() {
    for (let i = 0; i < 8; i++) {
      const queue = new Queue(`Q${i + 1}`);
      queue.position = this.calculatePosition(i);
      this.queues.push(queue);
    }
  }

  calculatePosition(index) {
    const angle = (index * 2 * Math.PI) / 8;
    return {
      x: Math.cos(angle) * 100,
      y: Math.sin(angle) * 100,
    };
  }

  startProcessing() {
    setInterval(() => this.processQueues(), 1000);
  }

  processQueues() {
    const leftQueue = this.queues[0];
    const rightQueue = this.queues[4];

    if (leftQueue.size > 0) {
      const worker = leftQueue.dequeue();
      console.log(`左側QueueからWorker ${worker.id} を処理`);
      this.executeWorker(worker);
    }

    if (rightQueue.size > 0) {
      const worker = rightQueue.dequeue();
      console.log(`右側QueueからWorker ${worker.id} を処理`);
      this.executeWorker(worker);
    }

    this.rotateProcessing();
  }

  executeWorker(worker) {
    worker.position = this.forecourt.position;
    console.log(`Worker ${worker.id} を実行 (優先度: ${worker.priority})`);
  }

  rotateProcessing() {
    this.currentPriority = (this.currentPriority % 10) + 1;
    console.log(`現在の優先度: ${this.currentPriority}`);
  }

  async end() {
    this.isRunning = false;
    console.log("ParadeLootシステムの終了処理を完了しました");
  }
}

// ブロック管理システム
class Block {
  constructor(id) {
    this.id = id;
    this.status = "operational";
    this.errorCount = 0;
    this.isRunning = false;
  }

  checkStatus() {
    if (Math.random() < 0.1) {
      this.status = "error";
      this.errorCount++;
      return "error";
    }
    return this.status;
  }

  end() {
    this.isRunning = false;
    console.log(`ブロック ${this.id} の終了処理を完了しました`);
  }
}

// Queueシステム
class Queue {
  constructor(id) {
    this.id = id;
    this.workers = [];
    this.size = 0;
    this.position = null;
  }

  enqueue(worker) {
    this.workers.push(worker);
    this.size++;
    console.log(`Queue ${this.id} に Worker ${worker.id} を追加`);
  }

  dequeue() {
    if (this.workers.length === 0) return null;
    const worker = this.workers.shift();
    this.size--;
    return worker;
  }

  cleanup() {
    this.workers = [];
    this.size = 0;
    console.log(`Queue ${this.id} のクリーンアップ完了`);
  }
}

// テスト実行
async function testSystem() {
  try {
    // パークを作成
    const park = new Park("テーマパーク", 1000);

    // 開園
    await park.start();

    // テストプログラム
    const testProgram = `
            const result = 42;
            console.log('プログラム実行中...');
            return result;
        `;

    // パスポートとプログラムを持つGuestWorkerを作成
    const passport = new OneDayPassPort(5);
    const worker = new GuestWorker("guest-001", passport, testProgram);

    // Workerを追加
    await park.addGuestWorker(passport);

    // プログラムを実行
    const result = await worker.execute();
    console.log("プログラム実行結果:", result);

    // 危険なコードのテスト
    try {
      const dangerousWorker = new GuestWorker(
        "guest-002",
        new OneDayPassPort(5),
        'require("fs").readFileSync("/etc/passwd")'
      );
      await dangerousWorker.execute();
    } catch (error) {
      console.log("危険なコードが検出されました:", error.message);
    }

    // パーク終了
    await park.end();

    console.log("\nテスト完了");
  } catch (error) {
    console.error("エラーが発生しました:", error.message);
  }
}

// テスト実行
testSystem();
