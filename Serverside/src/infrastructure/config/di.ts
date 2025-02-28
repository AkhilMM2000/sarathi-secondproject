import { container } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/IUserepository"; 
import { MongoUserRepository } from "../database/MongoUserRepository";
import { HashService} from "../../application/services/HashService";
import { EmailService } from "../../application/services/Emailservice"; 
import { IDriverRepository } from "../../domain/repositories/IDriverepository";
import { MongoDriverRepository } from "../database/MongodriverRepository";
import { IFileStorageService } from "../../domain/services/IFileStorageService";
import { CloudinaryFileStorageService } from "../services/cloudstorageservice"; 
// Register repositories
container.register<IUserRepository>("IUserRepository", { useClass: MongoUserRepository });
container.register<IDriverRepository>("IDriverRepository", { useClass:MongoDriverRepository })
// Register services
container.register<HashService>("HashService", { useClass: HashService });
container.register<EmailService>("EmailService", { useClass: EmailService });

container.registerSingleton<IFileStorageService>("IFileStorageService",  CloudinaryFileStorageService)
