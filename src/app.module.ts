import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmpresasModule } from './empresas/empresas.module';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [UsersModule, EmpresasModule, AuthModule],
  
})
export class AppModule {}
