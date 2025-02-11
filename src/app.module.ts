import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmpresasModule } from './empresas/empresas.module';



@Module({
  imports: [UsersModule, EmpresasModule],
  
})
export class AppModule {}
