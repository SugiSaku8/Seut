import { init, get_blank, get_ntn_blank } from "../utils.js";
import { v } from "../Ri/T/PK.js";
import geral from "../geral/main.js";
import spe_cmd from "../special-cmd/main.js";
const DC = class {
  constructor(ram) {
    init(ram, "memory");
    this.ram = ram;
  }
  ordar(cmd, DCclass, config) {
    let type;
    let memory;
    memory = DCclass.get();
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
        cmd: {
          make: cmd.time,
          command: cmd.cmd.command,
        },
        build: {
          make: NowTime,
          slot: m0,
        },
      };
      DCclass.ram[m0] = m0_obj;
      let m1_obj = {
        log: {
          Nowtime:
            "Slots were allocated and orders were sent to various agencies.",
        },
      };
      DCclass.ram[m1] = m1_obj;
      if ((type = "geral-cmd")) {
        geral(m0, m1, config);
      }
      if ((type = "special-cmd")) {
        spe_cmd(m0, m1, config);
      }
    } else {
      if (config.true) {
        console.error(
          type +
            "Network configuration is an incorrect shape. \nPlease check if you have added version to the configuration item."
        );
      } else {
        ;
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
