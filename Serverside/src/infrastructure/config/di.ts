import { container } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/IUserepository"; 
import { MongoUserRepository } from "../database/MongoUserRepository";
import { HashService} from "../../application/services/HashService";
import { EmailService } from "../../application/services/Emailservice"; 
// Register repositories
container.register<IUserRepository>("IUserRepository", { useClass: MongoUserRepository });

// Register services
container.register<HashService>("HashService", { useClass: HashService });
container.register<EmailService>("EmailService", { useClass: EmailService });

