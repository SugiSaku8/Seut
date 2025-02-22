// 基本クラスの定義
export default class Worker {
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
}

export  class GuestWorker extends Worker {
    constructor(id, passport, program) {
        super(id, 'Guest');
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
            console.error(`Worker ${this.id} のプログラム実行エラー: ${error.message}`);
            throw error;
        }
    }
}

