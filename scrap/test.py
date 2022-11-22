import datetime
import multiprocessing
import platform
import threading
import time
import os
import psutil
from psutil import *
import GPUtil
import cpuinfo
test=cpuinfo.get_cpu_info()
print(test)
"""
import yaml

with open('/proc/cpuinfo', 'r') as fd: 
   stat = fd.read() 
   print(stat)
   stat = stat.replace('\t', '') 
   stat = stat.split('\n\n') 
   l = [yaml.load(s) for s in stat] 
   print(l)"""