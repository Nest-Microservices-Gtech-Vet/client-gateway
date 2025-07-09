import { Module } from '@nestjs/common';

import { MascotasController } from './mascotas.controller';
import { NatsModule } from 'src/transports/nats.module';
import { PatologiaModule } from './patologia/patologia.module';
import { RazaModule } from './raza/raza.module';
import { EspecieModule } from './especie/especie.module';
import { VacunaModule } from './vacuna/vacuna.module';
import { ConsultaModule } from './consulta/consulta.module';
import { HistoriaClinicaModule } from './historia-clinica/historia-clinica.module';
import { EspecieRazaPatologiaModule } from './especie-raza-patologia/especie-raza-patologia.module';

import { TratamientoModule } from './tratamiento/tratamiento.module';
import { MedicamentoModule } from './medicamento/medicamento.module';


@Module({
  controllers: [MascotasController],
  providers: [],
  imports: [ NatsModule, PatologiaModule, RazaModule, EspecieModule, VacunaModule, ConsultaModule, HistoriaClinicaModule, EspecieRazaPatologiaModule, MedicamentoModule, TratamientoModule
      ],
})
export class MascotasModule {}
