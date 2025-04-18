import { container } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/IUserepository"; 
import { MongoUserRepository } from "../database/MongoUserRepository";
import { HashService} from "../../application/services/HashService";
import { EmailService } from "../../application/services/Emailservice"; 
import { IDriverRepository } from "../../domain/repositories/IDriverepository";
import { MongoDriverRepository } from "../database/MongodriverRepository";
import { IFileStorageService } from "../../domain/services/IFileStorageService";
import { CloudinaryFileStorageService } from "../services/cloudstorageservice"; 
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { MongoVehicleRepository } from "../database/MongoVehicleRepository";
import { RedisUserRegistrationStore } from "../store/UserRegisterStore";
import { IRedisrepository } from "../../domain/repositories/IRedisrepository";
import { GoogleDistanceService } from "../../application/services/GoogleDistanceService";
import { SMSService } from "../../application/services/MSService";
import { TwilioSMSService } from "../services/TwilioSMSService";
import { IBookingRepository } from "../../domain/repositories/IBookingrepository";
import { IFareCalculatorService } from "../../application/services/FareCalculatorService";
import { MongoBookingRepository } from "../database/MongoBookingRepository";
import { FareCalculatorService } from "../services/FareCalculatorService";
import { IStripeAccountService } from "../../application/services/Accountservice";
import { StripeService } from "../services/Accountservice";
import { IStripeService } from "../../domain/services/IStripeService";
import { PaymentService } from "../services/StripeService";

// Register repositories
container.register<IUserRepository>("IUserRepository", { useClass: MongoUserRepository });
container.register<IDriverRepository>("IDriverRepository", { useClass:MongoDriverRepository })
container.register<IVehicleRepository>("IVehicleRepository",{useClass:MongoVehicleRepository})
container.register<IBookingRepository>("IBookingRepository",{ useClass: MongoBookingRepository });
// Register services
container.register<HashService>("HashService", { useClass: HashService });
container.register<EmailService>("EmailService", { useClass: EmailService });

container.registerSingleton<IFileStorageService>("IFileStorageService",  CloudinaryFileStorageService)

container.registerSingleton<IRedisrepository>(
    "UserRegistrationStore",
    RedisUserRegistrationStore
  );
  container.registerSingleton<GoogleDistanceService>("GoogleDistanceService", GoogleDistanceService);
  container.register<SMSService>("SMSService", { useClass: TwilioSMSService });

  


  container.register<IFareCalculatorService>("IFareCalculatorService", {
    useClass: FareCalculatorService,
  });

  container.register<IStripeAccountService>('StripeService', {
    useClass: StripeService,
  });
  container.register<IStripeService>('StripePaymentService', {
    useClass:PaymentService
  });
