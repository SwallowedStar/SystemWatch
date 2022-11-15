ALTER TABLE corestatus
ADD CONSTRAINT pk_corestatus PRIMARY KEY (time, idCore, computerID)

ALTER TABLE computer
ADD CONSTRAINT fk_computer_cpu_CPUid FOREIGN KEY (CPUid) REFERENCES cpu(CPUid);

ALTER TABLE core
ADD CONSTRAINT fk_core_computer_computerID FOREIGN KEY (computerID) REFERENCES computer(computerID);

ALTER TABLE monitor
ADD CONSTRAINT fk_inputtime_computer_computerid FOREIGN KEY (computerID) REFERENCES computer(computerID);

ALTER TABLE corestatus
ADD CONSTRAINT fk_corestatus_inputtime_time_computerID FOREIGN KEY (time) REFERENCES monitor(time);

ALTER TABLE corestatus
ADD CONSTRAINT fk_corestatus_inputtime_computerID FOREIGN KEY (computerID) REFERENCES monitor(computerID);

ALTER TABLE corestatus
ADD CONSTRAINT fk_corestatus_core FOREIGN KEY (idCore) REFERENCES core(idCore);