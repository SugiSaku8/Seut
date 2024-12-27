import DC from "seut/DC/main.js";
import geral from "seut/geral/main.js";
import spe_cmd from "seut/special-cmd/main.js";
import {
  init,
  init_ram,
  init_storage,
  get_blank,
  get_ntn_blank,
} from "seut/utils.js";

export const seut = {
  init: function (type,size) {
    if ((type = "liquidity")) {
      let ram = {
        size:size
      };
      try {
       let network = new DC(ram,size);
        return network;
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
