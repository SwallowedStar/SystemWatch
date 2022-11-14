import datetime
import multiprocessing
import platform
import threading
import time
import os
import psutil
from psutil import *
import GPUtil
import socket
import cpuinfo

"""
# Compliqué a expliquer mais pas tres utile ?
print("CPU_TIME")
print(cpu_times_percent())

#Nb coeur cpu, et si cpu_count(logical=false), retourne le nb de coeur physique
print("CPU COUNT")
print(cpu_count())

# Retourne deverses stats spu (interruption, nb call system ...)
print("CPU STATS")
print(cpu_stats())

# retourne freq du cpu
print("CPU FREQ")
print(cpu_freq(percpu=True))
# getloadavg mais pas utile celui la , trop precis

#Stats sur la memoire
print("Stats Memmory")
print(virtual_memory())

# Infos sur les artitions disk
print("Disk partitions")
print(disk_partitions())

#Infos sur usage disk
print("Disk usage")
print(disk_usage(path))

# Stats network
print("Network stats")
print(net_io_counters())

#Temperature  + vitesse FANS, ONLY LINUX
print("Temparature")
print(sensors_temperatures())
print("Fans vitesse")
print(sensors_fans())

#Battery (utile ou pas ? )
print("Batteri")
print(sensors_battery())



gpu=GPUtil.getGPUs()[0]
print("temperature gpu")
print(gpu.temperature)
print(GPUtil.showUtilization())
print(GPUtil.getAvailable())
"""


def calc_generale(incr):
    if (incr == 0):
        nb_thread = 0
        nb_proc = 0
        for x in psutil.process_iter(attrs=None, ad_value=None):
            nb_thread += x.num_threads()
            nb_proc += 1
        return [nb_thread, nb_proc]
    elif (incr == 1):
        # GET infos for computer table
        computer_name = socket.gethostname()
        gpu = GPUtil.getGPUs()
        if (gpu == []):
            cpu_name = cpuinfo.get_cpu_info()['brand_raw']

            name_os = platform.system()
            core_number = multiprocessing.cpu_count()
            memoire = psutil.virtual_memory()
            quantity_ram = memoire.total

            return [computer_name, cpu_name, 0, name_os, core_number, quantity_ram, 0]

        else:

            cpu_name = cpuinfo.get_cpu_info()['brand_raw']
            gpu_name = gpu.name
            name_os = platform.system()
            core_number = multiprocessing.cpu_count()
            memoire = psutil.virtual_memory()
            quantity_ram = memoire.total
            quantity_vram = gpu.memoryTotal

            return [computer_name, cpu_name, gpu_name, name_os, core_number, quantity_ram, quantity_vram]

    elif (incr == 2):
        memoire = psutil.virtual_memory()
        ram_usage = memoire.used
        gpu = GPUtil.getGPUs()
        if (gpu == []):
            freq_cpu = cpu_freq()
            # rajouter min max freq
            fan_sensor = sensors_fans()
            return [ram_usage, 0, 0, freq_cpu.current, 0, fan_sensor]
        else:
            gpu = GPUtil.getGPUs()[0]
            gpu_temp = gpu.temperature
            gpu_usage = gpu.load
            # Only on Linux
            freq_cpu = cpu_freq()
            freq_cpu = freq_cpu.current
            vram_usage = gpu.memoryUsed
            fan_sensor = sensors_fans()
            return [ram_usage, gpu_temp, gpu_usage, freq_cpu, vram_usage, fan_sensor]
    elif (incr == 3):
        all_coeur = sensors_temperatures()
        all_freq = cpu_freq(percpu=True)
        tab_temp = []
        tab_usage = []
        for element in all_coeur["coretemp"]:
            if ("Core" in element.label):
                tab_temp.append(element.current)
        for element in all_freq:
            tab_usage.append(element.current)

        return [tab_temp, tab_usage]


def res_func(res):
    res_l.append(res)


if __name__ == "__main__":
    res_l = []
    ctx = multiprocessing.get_context("spawn")
    nb_proc = 4
    incr = 0
    res = []
    with ctx.Pool(processes=nb_proc) as p:
        date_deb = datetime.datetime.now()
        for x in range(0, nb_proc):
            p.apply_async(calc_generale, [incr], callback=res_func)
            incr += 1

        """test2 = p.apply_async(calc_2, [beforeArray, halfBlob,newImage,afterArray,blobSize])
        test3=p.apply_async(calc_3, [beforeArray, halfBlob,newImage,afterArray,blobSize])"""

        p.close()
        p.join()

        print(res_l)
        print(datetime.datetime.now() - date_deb)
        p.terminate()

# Fonctionne mais necessite de run en admin
"""import clr # the pythonnet module.
clr.AddReference("OpenHardwareMonitorLib")
# e.g. clr.AddReference(r'OpenHardwareMonitor/OpenHardwareMonitorLib'), without .dll

from OpenHardwareMonitor.Hardware import Computer

c = Computer()
c.CPUEnabled = True # get the Info about CPU
c.GPUEnabled = True # get the Info about GPU
c.Open()
while True:
    for a in range(0, len(c.Hardware[0].Sensors)):
        # print(c.Hardware[0].Sensors[a].Identifier)
        if "/temperature" in str(c.Hardware[0].Sensors[a].Identifier):
            print(c.Hardware[0].Sensors[a].get_Value())
            c.Hardware[0].Update()
            time.sleep(1)


"""