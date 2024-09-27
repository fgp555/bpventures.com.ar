import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/entities/user.entity';
import { Company } from 'src/entities/company.entity';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async seed() {
    if (await this.userRepository.count() > 0) {
      return;
    }

    const companies = await this.companyRepository.find();

    const users = [];

    console.log("process.env.USER_ADMIN", process.env.USER_ADMIN);

    const fedeAdmin = new UserEntity();
    fedeAdmin.email = process.env.USER_ADMIN;
    fedeAdmin.password = await bcrypt.hash(process.env.PASS_ADMIN, 10); // Contraseña = email
    fedeAdmin.Names = 'Federico';
    fedeAdmin.LastName = 'Giusti';
    fedeAdmin.Position = 'Admin';
    fedeAdmin.verifiedEmail = true;
    fedeAdmin.mfaEnabled = false;
    fedeAdmin.mfaBackupCodes = '';
    fedeAdmin.mfaSecret = '';
    fedeAdmin.mfaVerified = null;
    fedeAdmin.createdAt = new Date();
    fedeAdmin.modifiedAt = new Date();
    fedeAdmin.isAdmin = true;
    fedeAdmin.company = companies[6]; // Asignar la segunda compañía
    fedeAdmin.imgProfile = "https://i.postimg.cc/Qx312GfY/fede.jpg";

    users.push(fedeAdmin);

    // Guardar todos los usuarios en la base de datos
    await this.userRepository.save(users);
    console.info('Seeded user');
  }
}
