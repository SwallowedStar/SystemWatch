import datetime
import multiprocessing
import platform
import threading
import time
import os
import psutil
from psutil import *
import GPUtil

computer_name = os.environ['COMPUTERNAME']
gpu = GPUtil.getGPUs()[0]
cpu_name = platform.processor()
gpu_name = gpu.name
name_os = platform.system()
core_number = multiprocessing.cpu_count()
memoire = psutil.virtual_memory()
quantity_ram = memoire.total
quantity_vram = gpu.memoryTotal