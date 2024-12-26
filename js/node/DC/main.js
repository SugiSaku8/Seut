import { init, get_blank, get_ntn_blank } from "../utils.js";
import { v } from "../Ri/T/PK.js";
import geral from "../geral/main.js";
import spe_cmd from "../special-cmd/main.js";
import pycmd from "../pycmd/pycmd.js";
import readline from 'readline';
const DC = class {
  constructor(ram) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    let progress = 0;
    readline.moveCursor(process.stdout, -process.stdout.columns, 1);
    readline.clearLine(process.stdout, 0); 
    process.stdout.write(`DC init Progress: ${progress}%`);
    init(ram, "memory",100);
    readline.moveCursor(process.stdout, -process.stdout.columns, 0);
    readline.clearLine(process.stdout, 0); 
    progress = 50;
    process.stdout.write(`DC init Progress: ${progress}%`);
    this.ram = ram;
    readline.moveCursor(process.stdout, -process.stdout.columns, 0);
    readline.clearLine(process.stdout, 0); 
    progress = 100;
    process.stdout.write(`DC init Progress: ${progress}%`);

    console.log('\nDC initialization is complete!');
    rl.close();
  }
  async ordar(cmd, config) {
    let type;
    let memory;
    memory = this.get();
    type = cmd.type;
    switch (type) {
      case "geral-cmd":
        switch (config.network.type) {
          case "cell":
            switch (v.check(cmd.command.raw)) {
              case true:
                console.warn(
                  "The defenses of the cell network detected that the specified command was suspicious.\nthis is supercalifragilisticexpialidocious!"
                );
                return {
                  status: false,
                  log: "Detected by cell network defense function",
                };
            }
          default:
            break;
        }
      case "special-cmd":
        switch (config.network.type) {
          case "cell":
            switch (v.check(cmd.command.raw)) {
              case true:
                console.warn(
                  "The defenses of the cell network detected that the specified command was suspicious.\nthis is supercalifragilisticexpialidocious!"
                );
                return {
                  status: false,
                  log: "Detected by cell network defense function",
                };
            }
          default:
            break;
        }
      case "pycmd":
        switch(config.pycmd.type){
          case "AI":
            if(config.pycmd.ml.runtime = null){
                  console.warn("Runtime is not specified. \nUse the default CPU runtime.")
            }
        }
      default:
        switch (type) {
          case null:
            console.warn("Specify the instruction type.");
          case undefined:
            console.warn("Specify the instruction type.");
          default:
            break;
        }
        break;
    }
    let m0 = get_blank(memory);
    let m1 = get_ntn_blank(memory);
    let NowTime = new Date(memory);
    if (
      cmd.name != undefined &&
      cmd.sender != undefined &&
      config.version != undefined &&
      cmd.time != undefined &&
      cmd.cmd.command != undefined
    ) {
      let m0_obj = {
        name: cmd.name,
        sender: cmd.sender,
        version: config.version,
        "cmd": {
          make: cmd.time,
          command: cmd.cmd.command,
        },
        build: {
          make: NowTime,
          slot: m0,
        },
        config:{
          raw:config
        }
      };
      this.ram[m0] = m0_obj;
      let m1_obj = {
        log: {
          Nowtime:
            "Slots were allocated and orders were sent to various agencies.",
        },
      };
      this.ram[m1] = m1_obj;
      console.log(this.ram[m0])
      if ((type === "geral-cmd")) {
        geral(m0, m1, config);
        console.log("Entrusted to Geral.")
      }
      if ((type === "special-cmd")) {
        spe_cmd(m0, m1, config);
        console.log("Entrusted to Specia-cmd")
      }
      if((type === "pycmd")){
        await pycmd.run(m0,m1,config);
        console.log("Entrusted to PyCmd")
      }
    } else {
      if (config.true) {
        console.error(
          type +
            "Network configuration is an incorrect shape. \nPlease check if you have added version to the configuration item."
        );
      }
      if(typeof cmd.name == 'undefined'){
console.error("The cmd object must have a name element.")
      }
      if(typeof cmd.sender  ==  'undefined'){
        console.error("The cmd object must have a sender element.")

      }
      if(typeof config.version  == 'undefined'){
        console.error("The cmd object must have a version element.")

      }
      if(typeof cmd.time == 'undefined'){
        console.error("The cmd object must have a time element.")

      }
      if(typeof cmd.cmd==  'undefined'){
        console.error("A cmd object requires a cmd element.")
        console.error("The cmd.cmd object requires a command object.")
        console.error("Of course. If you don't specify an order, the command post won't do anything for you, okay?")
      }
    }
  }
  get() {
    return this.ram;
  }
  post(req) {
    let ID = req.id;
    let data = req.data;
    let r0 = get_blank();
    let r1 = get_ntn_blank();
    r0 = "awarded:" + ID;
    r1 = "=> " + data;
  }
};
export default DC;
