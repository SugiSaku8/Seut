import DC from "./DC/main.js";
import geral from "./geral/main.js";
import spe_cmd from "./special-cmd/main.js";
import {
  init,
  init_ram,
  init_storage,
  get_blank,
  get_ntn_blank,
} from "./utils.js";
const sort = {
  init: function (name, type) {
    if ((type = "liquidity")) {
      let ram = {
        size: 10000,
      };
      try {
        name = new DC(ram);
      } catch (e) {
        console.error("Network could not be initialized.\n" + e);
      }
    }
  },
  geral: geral,
  spe_cmd: spe_cmd,
  utils: {
    init: init,
    init_ram: init_ram,
    init_storage: init_storage,
    get_blank: get_blank,
    get_ntn_blank: get_ntn_blank,
  },
};
