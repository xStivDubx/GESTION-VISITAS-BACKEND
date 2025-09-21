import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AdmUser } from '../models/user.entity';
import { Role } from '../models/role.entity';
import { Permission } from '../models/permission.entity';
import { RolePermission } from '../models/role-permission.entity';
import * as dotenv from "dotenv";

dotenv.config();

const url: string = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?ssl=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`;
export const AppDataSource = new DataSource({
  type: "mysql",
  url: url,
  entities: [AdmUser, Role, Permission, RolePermission],
  synchronize: false,
  logging: false,
});
