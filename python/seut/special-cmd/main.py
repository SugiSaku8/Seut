# js/node/special_cmd/main.py
def spe_cmd(m0, m1, config):
    name = m0['name']
    sender = m0['sender']
    version = m0['version']
    awaTime = datetime.now()
    cmd = {
        'make': m0['cmd']['time'],
        'command': m0['cmd']['command'],
    }
    report = {
        'Name': name,
        'Order Sender': sender,
        'Config Version': version,
        'Awarded': awaTime,
    }
    m1['log'][datetime.now()] = "Notify the command post of the consignment."
    config['DC'].post(report)
    try:
        result = cmd['command']()
    except Exception as e:
        print("Error occurs at consignment site.\n" + str(e))
        m1['log'][datetime.now()] = f"Error occurs at consignment site.\n{e}"
        return False
    m1['log'][datetime.now()] = "The entrusted order has been terminated."
    return True