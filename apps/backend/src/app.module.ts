import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration } from './config/configuration';

// Feature modules will be registered here as they're built, e.g.:
// import { VehiclesModule } from './modules/vehicles/vehicles.module';
// import { ComparisonModule } from './modules/comparison/comparison.module';
// import { RecommendationModule } from './modules/recommendation/recommendation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // VehiclesModule,
    // ComparisonModule,
    // RecommendationModule,
  ],
})
export class AppModule {}
