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
import requests as rq
<<<<<<< HEAD
from dotenv import load_dotenv
=======
>>>>>>> 9e61d73 (finish link scrap to api ( few opitmization + comments to do ))


def calc_generale(incr):
    os_name = platform.system()
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
        cpu_name = cpuinfo.get_cpu_info()['brand_raw']

        if (gpu == []):

            name_os = platform.system()
            core_number = multiprocessing.cpu_count()
            memoire = psutil.virtual_memory()
            quantity_ram = memoire.total

            return [computer_name, cpu_name, 0, name_os, core_number, quantity_ram, 0]

        else:
            gpu = GPUtil.getGPUs()[0]
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

        if(os_name=="Windows"):
            freq_cpu = cpu_freq()
            min_cpu=freq_cpu.min
            max_cpu=freq_cpu.max
            import clr as clllr
            file = "OpenHardwareMonitorLib"

            clllr.AddReference(file)
            from OpenHardwareMonitor import Hardware
            handle = Hardware.Computer()
            handle.CPUEnabled = True
            handle.Open()
            frequence_cpu=0
            compt=0
            for i in handle.Hardware:
                i.Update()
                for sensor in i.Sensors:
                    if sensor.SensorType.ToString() == "Clock" and "Core" in sensor.Name:
                        frequence_cpu += sensor.Value
                        compt+=1

            frequence_cpu=frequence_cpu/compt

            if (gpu == []):
                
                # rajouter min max freq
                
                return [ram_usage, 0, 0, cpu_freq,min_cpu,max_cpu, 0, 0]
            else:
                gpu = GPUtil.getGPUs()[0]
                gpu_temp = gpu.temperature
                gpu_usage = gpu.load
                vram_usage = gpu.memoryUsed
               
                return [ram_usage, gpu_temp, gpu_usage, freq_cpu,min_cpu,max_cpu, vram_usage, 0]
        elif(os_name=="Linux"):
            freq_cpu = cpu_freq()
            freq_cpu_current = freq_cpu.current
            min_cpu=freq_cpu.min
            max_cpu=freq_cpu.max
            if (gpu == []):
                
                # rajouter min max freq
                
                return [ram_usage, 0, 0, freq_cpu_current,min_cpu,max_cpu, 0, 0]
            else:
                gpu = GPUtil.getGPUs()[0]
                gpu_temp = gpu.temperature
                gpu_usage = gpu.load
                # Only on Linux
                vram_usage = gpu.memoryUsed
                
              
                return [ram_usage, gpu_temp, gpu_usage, freq_cpu_current,min_cpu,max_cpu, vram_usage, 0]

    elif (incr == 3):
        if(os_name=="Windows"):
            import clr as clllr
            file = "OpenHardwareMonitorLib"

            clllr.AddReference(file)
            from OpenHardwareMonitor import Hardware
            handle = Hardware.Computer()
            handle.CPUEnabled = True
            handle.Open()
            frequence_cpu=[]
            temperature_cpu=[]
            for i in handle.Hardware:
                i.Update()
                for sensor in i.Sensors:
                    if (sensor.SensorType.ToString() == "Clock" and "Core" in sensor.Name):
                        frequence_cpu.append(sensor.Value)
                    elif(sensor.SensorType.ToString()=="Temperature" and "Core" in sensor.Name):
                        temperature_cpu.append(sensor.Value)

            return [frequence_cpu,temperature_cpu]
        elif(os_name=="Linux"):
       
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
    boolean=True

    while boolean:
        #print("Lancement processus")
        load_dotenv()
        IP_HOST= os.getenv('IP_HOST')
        LISTEN_PORT=os.getenv("LISTEN_PORT")

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
            p.close()
            p.join()

           
            #print(datetime.datetime.now() - date_deb)
            p.terminate()

            #Now lets do the request
            l_test_for=[]
            l_thread_proc=[]
            l_multiple_core=[]
            l_various_usage=[]
            l_general_infos=[]
            for x in res_l:
                if(len(x)==2):
                    if(isinstance(x[0], list)):
                        l_multiple_core=[x]
                    else:
                        l_thread_proc=[x]
                elif(len(x)==7):
                    l_general_infos=[x]

                elif(len(x)==8):
                    l_various_usage=[x]

         

            r=rq.get("http://"+IP_HOST+":"+LISTEN_PORT+"/api/computer/find/"+l_general_infos[0][0])
            data=r.json()
            pc_exist=True
            time_send=str(datetime.datetime.now())
            if("error" in data):
                pc_exist=False
                
                json_cpu={
                    "CPUname":l_general_infos[0][1],
                    "coreNumber":l_general_infos[0][4],
                    "minFrequency":l_various_usage[0][4],
                    "maxFrequency":l_various_usage[0][5]
                }
                json_info_computer={
                    "computerName":l_general_infos[0][0],
                    "GPUname":l_general_infos[0][2],
                    "amountRAM":l_general_infos[0][5],
                    "amountVRAM":l_general_infos[0][6],
                    "CPU":json_cpu
                }
                json_monitor={
                    "time":time_send,
                    "RAMusage":l_various_usage[0][0],
                    "nbThreads":l_thread_proc[0][0],
                    "nbProcesses":l_thread_proc[0][1],
                    "GPUtemp":l_various_usage[0][1],
                    "CPUfreq":l_various_usage[0][3],
                    "VRAMusage":l_various_usage[0][6],
                    "electricalConsumption":0
                }
                rq.post("http://"+IP_HOST+":"+LISTEN_PORT+"/api/computer/complete",json=json_info_computer)
                rq.post("http://"+IP_HOST+":"+LISTEN_PORT+"/api/monitor",json=json_monitor)


            elif(pc_exist==True):
                json_monitor={
                    "time":time_send,
                    "computerID":data["computerID"],
                    "RAMusage":l_various_usage[0][0],
                    "nbThreads":l_thread_proc[0][0],
                    "nbProcesses":l_thread_proc[0][1],
                    "GPUtemp":l_various_usage[0][1],
                    "CPUfreq":l_various_usage[0][3],
                    "VRAMusage":l_various_usage[0][6],
                    "electricalConsumption":0
                }
            

                rq.post("http://"+IP_HOST+":"+LISTEN_PORT+"/api/monitor",json=json_monitor)
        

                i=0
                for x in data["cores"]:
                    json_core={
                        "time":time_send,                    
                        "computerID":data["computerID"],
                        "idCore":x["idCore"],
                        "coreFrequency":l_multiple_core[0][1][i],
                        "coreTemp":l_multiple_core[0][0][i]
                    }
                    i+=1
                    rq.post("http://"+IP_HOST+":"+LISTEN_PORT+"/api/corestatus",json=json_core)

                
            time.sleep(0.5)


            """if(x["computerName"]==l_general_infos[0][0]):
                    comput_id=x["computerID"]"""
            
            """

            time_send=str(datetime.datetime.now())
            print(time_send)



            json_monitor={
                "time":time_send,
                "computerID":comput_id,
                "RAMusage":l_various_usage[0][0],
                "nbThreads":l_thread_proc[0][0],
                "nbProcesses":l_thread_proc[0][1],
                "GPUtemp":l_various_usage[0][1],
                "CPUfreq":l_various_usage[0][3],
                "VRAMusage":l_various_usage[0][6],
                "electricalConsumption":0
            }


            nb_core=l_general_infos[0][4]
            for x in range(1,nb_core+1):
                json_core_status={
                    "time":time_send,
                    "computerID":comput_id,
                    "idCore":x,
                    "coreFrequency":l_multiple_core[0][0][x-1],
                    "coreTemp":l_multiple_core[0][1][x-1]
                }
                print(json_core_status)"""






            
            """ Post le computer + le cpu
            print(rq.post("http://192.168.0.19:3000/api/computer/complete",json=json_info_computer))"""
            #print(rq.get("http://192.168.0.19:3000/api/ping"))
            #rq.delete("http://192.168.0.19:3000/api/cpu/64")
            """r=rq.get("http://192.168.0.19:3000/api/computers")
            data=r.json()

            for x in data:
                if(x["computerName"]==l_general_infos[0][0]):
                    comput_id=x["computerID"]
            




            r=rq.get("http://192.168.0.19:3000/api/cpus")
            data=r.json()"""




        




