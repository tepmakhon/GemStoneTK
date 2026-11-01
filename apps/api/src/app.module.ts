import { Module } from '@nestjs/common';
import { CatalogController } from './catalog/catalog.controller';
import { CatalogService } from './catalog/catalog.service';
import { PrismaService } from './database/prisma.service';
import { HealthController } from './health/health.controller';

@Module({
  controllers: [HealthController, CatalogController],
  providers: [PrismaService, CatalogService],
})
export class AppModule {}
