import connect from "../connect/connect.js";
export const pycmd = {
  run: async function(m0, m1, config) {
    let name = m0.name;
    let sender = m0.sender;
    let version = m0.version;
    let awaTime = new Date();
    let cmd = {
      command: m0.cmd,
    };
    let report = {
      Name: name,
      "Order Sender": sender,
      "Config Version": version,
      Awarded: awaTime,
    };
    m1.log[new Data()] = "Pycmd:Notify the command post of the consignment.";
    config.DC.post(report);
    if ((config.raw.pycmd.type = "AI")) {
      await pycmd.ml(m0, m1, config);
    }
    if ((config.raw.pycmd.type = "general")) {
      await pycmd.geral(m0, m1, config);
    }
  },
  geral: function (m0, m1, config) {
    console.warn("Pycmd:This feature is not implemented.");
  },
  ml: async function (m0, m1, config) {
    let name = m0.name;
    let sender = m0.sender;
    let version = m0.version;
    let awaTime = new Date();
    let cmd = {
      make: m0.time,
      command: m0.cmd,
    };
    let report = {
      Name: name,
      "Order Sender": sender,
      "Config Version": version,
      Awarded: awaTime,
    };
    m1.log[new Date()] = "Pycmd-ML:Notify the command post of the consignment.";
    config.DC.post(report);
    try {
      let data = {
        config: {
          Name: name,
          "Order Sender": sender,
          "Config Version": version,
          Awarded: Date.now(),
        },
        cmd: {
          make: m0.cmd.time,
          command: c0.cmd.command,
          rawObj: c0.cmd,
        },
      };
      let r_data = await connect(data, 3982);
    } catch (e) {
      console.error("Pycmd-ML:Request failed.\n" + e);
      m1.log[new Date()] = "Pycmd-ML:Request failed.\n" + e;
      return false;
    }
    m1.log[new Date()] = "Pycmd-ML:The entrusted order has been terminated.";
    try {
      console.log(t_data)
      return t_data;
    } catch (e) {
      console.error("Pycmd-ML:Invalid server response.\n" + e);
      m1.log[new Date()] = "Pycmd-ML:Invalid server response.\n" + e;
      return false;
    }
  },
};
export default pycmd;
