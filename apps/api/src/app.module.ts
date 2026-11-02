import { Module } from '@nestjs/common';
import { CatalogController } from './catalog/catalog.controller';
import { CatalogService } from './catalog/catalog.service';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [DatabaseModule, AdminModule],
  controllers: [HealthController, CatalogController],
  providers: [CatalogService],
})
export class AppModule {}
