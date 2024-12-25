export function geral(m0, m1, config) {
  let name = m0.name;
  let sender = m0.sender;
  let version = m0.version;
  let awaTime = new Date();
  let cmd = {
    make: m0.cmd.time,
    command: m0.cmd.command,
  };
  let report = {
    Name: name,
    "Order Sender": sender,
    "Config Version": version,
    Awarded: awaTime,
  };
  m1.log[new Data()] = "Notify the command post of the consignment.";
  config.DC.post(report);
  try {
    cmd.command();
  } catch (e) {
    console.error("Error occurs at consignment site.\n" + e);
    m1.log[new Data()] = "Error occurs at consignment site.\n" + e;
    return false;
  }
  m1.log[new Data()] = "The entrusted order has been terminated.";
  return true;
}
