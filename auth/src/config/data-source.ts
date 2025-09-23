import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AdmUser } from '../models/user.entity';
import { Role } from '../models/role.entity';
import { Permission } from '../models/permission.entity';
import { RolePermission } from '../models/role-permission.entity';
import * as dotenv from "dotenv";

dotenv.config();

const url: string = process.env.DB_URL;
export const AppDataSource = new DataSource({
  type: "mysql",
  url: url,
  entities: [AdmUser, Role, Permission, RolePermission],
  synchronize: false,
  logging: false,
});
