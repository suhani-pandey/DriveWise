import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import {
  SaveVehicleRequestSchema,
  UpdateSavedVehicleRequestSchema,
  type SaveVehicleRequest,
  type SavedListResponse,
  type SavedVehicle,
  type UpdateSavedVehicleRequest,
} from '@drivewise/contracts';

import { ZodValidationPipe } from '../../../shared/pipes/zod-validation.pipe';
import { SavedVehiclesService } from '../application/saved-vehicles.service';

/**
 * Watchlist endpoints. Identity is an anonymous per-browser id supplied via
 * the x-user-id header; swap for Clerk-authenticated user ids later without
 * changing routes.
 */
@Controller('saved-vehicles')
export class SavedVehiclesController {
  constructor(private readonly savedVehicles: SavedVehiclesService) {}

  private requireUser(userId: string | undefined): string {
    if (!userId || userId.trim().length === 0) {
      throw new BadRequestException('x-user-id header is required');
    }
    return userId;
  }

  @Get()
  list(@Headers('x-user-id') userId?: string): Promise<SavedListResponse> {
    return this.savedVehicles.list(this.requireUser(userId));
  }

  @Put()
  save(
    @Body(new ZodValidationPipe(SaveVehicleRequestSchema)) request: SaveVehicleRequest,
    @Headers('x-user-id') userId?: string,
  ): Promise<SavedVehicle> {
    return this.savedVehicles.save(this.requireUser(userId), request);
  }

  @Patch(':vehicleId')
  update(
    @Param('vehicleId') vehicleId: string,
    @Body(new ZodValidationPipe(UpdateSavedVehicleRequestSchema))
    request: UpdateSavedVehicleRequest,
    @Headers('x-user-id') userId?: string,
  ): Promise<SavedVehicle> {
    return this.savedVehicles.update(this.requireUser(userId), vehicleId, request);
  }

  @Delete(':vehicleId')
  @HttpCode(204)
  async remove(
    @Param('vehicleId') vehicleId: string,
    @Headers('x-user-id') userId?: string,
  ): Promise<void> {
    await this.savedVehicles.remove(this.requireUser(userId), vehicleId);
  }
}
