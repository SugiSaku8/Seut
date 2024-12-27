const geral = function (m0, m1, config) {
  let name = m0.name;
  let sender = m0.sender;
  let version = m0.version;
  let awaTime = new Date();
  let cmd = {
    make: m0.make,
    cmd: m0.command,
  };
  let report = {
    Name: name,
    "Order Sender": sender,
    "Config Version": version,
    Awarded: awaTime,
  };
  const ordartime = m1.log.OrdarTime;
  let history = {
    OrdarTime: ordartime,
    CommandRunTime:Date.now()+": Geral:Notify the command post of the consignment."
  };
  m1.log = history;
  console.log("logging to Memory")
  config.DC.post(report,m1);
  try {
    console.log("Execute with Geral-cmd. Programs to run:"+cmd.cmd)
    let result = Function(cmd.cmd)();
    m1.log[new Date()] = "Geral:The entrusted order has been terminated.";
    return result;
  } catch (e) {
    console.error("Geral:Error occurs at consignment site.\n" + e);
    m1.log[new Date()] = "Geral:Error occurs at consignment site.\n" + e;
    return false;
  }
 
};
export default geral;
