from Modul_Wrapper import Wrap
from FastApi_J2S import Processing

loader = Wrap(modul_path="./cfg/modul.min", debug=False)
sin = Processing(loader=loader, config_path="./cfg/server_cfg.min")
data = sin.Run_Server()