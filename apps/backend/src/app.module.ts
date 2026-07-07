import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { configuration } from './config/configuration';
import { ComparisonModule } from './modules/comparison/comparison.module';
import { OwnershipCostModule } from './modules/ownership-cost/ownership-cost.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { SavedVehiclesModule } from './modules/saved-vehicles/saved-vehicles.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { AppErrorFilter } from './shared/errors/app-error.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    VehiclesModule,
    ComparisonModule,
    OwnershipCostModule,
    RecommendationModule,
    SavedVehiclesModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: AppErrorFilter }],
})
export class AppModule {}
