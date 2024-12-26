# js/node/index.py
from seut.DC.main import DC
from seut.geral.main import geral
from seut.special_cmd.main import spe_cmd
from seut.utils import init, init_ram, init_storage, get_blank, get_ntn_blank
from seut.connect import connect
from seut.build import build
class Seut:
    def __init__(self):
        self.geral = geral
        self.spe_cmd = spe_cmd
        self.utils = {
            'init': init,
            'init_ram': init_ram,
            'init_storage': init_storage,
            'get_blank': get_blank,
            'get_ntn_blank': get_ntn_blank,
        }
        self.connect = connect
        self.build = build

    def init(self, name, type):
        if type == "liquidity":
            ram = {'size': 10000}
            try:
                name = DC(ram)
                return name
            except Exception as e:
                print("Network could not be initialized.\n" + str(e))