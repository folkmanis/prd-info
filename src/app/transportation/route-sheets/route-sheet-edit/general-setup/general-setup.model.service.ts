import { inject, Service } from '@angular/core';
import { nullableString, pickNotNull } from 'src/app/library';
import { z } from 'zod';
import { Driver, TransportationDriverService } from '../../../drivers';
import { TransportationVehicleService, Vehicle } from '../../../vehicles';
import { RouteSheet, RouteSheetCreate, RouteSheetSchema, RouteSheetUpdate } from '../../schemas';

export type GeneralSetupModel = z.infer<typeof GeneralSetupModelService.prototype.generalSetupModelSchema>;

@Service()
export class GeneralSetupModelService {
  readonly #driverService = inject(TransportationDriverService);
  readonly #vehicleService = inject(TransportationVehicleService);

  #vehicleIdModelSchema = z.codec(RouteSheetSchema.shape.vehicle, z.string(), {
    decode: (vehicle) => vehicle._id,
    encode: async (id, ctx) => {
      try {
        const vehicle = await this.#findVehicle(id);
        return vehicle;
      } catch (error) {
        ctx.issues.push({
          code: 'custom',
          message: 'Vehicle not found',
          input: id,
        });
      }
      return z.NEVER;
    },
  });

  #driverIdModelSchema = z.codec(RouteSheetSchema.shape.driver, z.string(), {
    decode: (driver) => driver._id,
    encode: async (id, ctx) => {
      try {
        const driver = await this.#findDriver(id);
        return driver;
      } catch (error) {
        ctx.issues.push({
          code: 'custom',
          message: 'Driver not found',
          input: id,
        });
      }
      return z.NEVER;
    },
  });

  generalSetupModelSchema = z.object({
    year: z.number().min(1990),
    month: z.number().min(1).max(12),
    fuelRemainingStartLitres: z.number(),
    vehicle: this.#vehicleIdModelSchema,
    driver: this.#driverIdModelSchema,
    description: nullableString,
  });

  routeSheetToModel(routeSheet: RouteSheet | null): GeneralSetupModel {
    if (routeSheet) {
      return this.generalSetupModelSchema.decode(routeSheet);
    } else {
      return this.#newRouteSheetModel();
    }
  }

  async modelToRouteSheetCreate(model: GeneralSetupModel): Promise<RouteSheetCreate> {
    const create = pickNotNull(await this.generalSetupModelSchema.encodeAsync(model));
    return { ...create, trips: [], fuelPurchases: [] };
  }

  async modelToRouteSheetUpdate(model: Partial<GeneralSetupModel>): Promise<RouteSheetUpdate> {
    const update = await this.generalSetupModelSchema.partial().encodeAsync(model);
    return update;
  }

  #findDriver(id: string): Promise<Driver> {
    const driver = this.#driverService.getDriver(id);
    return driver;
  }

  #findVehicle(id: string): Promise<Vehicle> {
    const vehicle = this.#vehicleService.getVehicle(id);
    return vehicle;
  }

  #newRouteSheetModel(): GeneralSetupModel {
    const date = new Date();
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      fuelRemainingStartLitres: 0,
      driver: '',
      vehicle: '',
      description: '',
    };
  }
}
