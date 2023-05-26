import { DatabaseConnection } from './connection';
import {
  UserRepository,
  RoleRepository,
  PermissionRepository,
  RefreshTokenRepository,
  LanguageRepository,
  TranslationRepository,
  CategoryRepository,
  ImageRepository,
  ItemRepository,
  TagRepository,
} from './repositories';
import { IDbConfig } from '../types/interface';
import { Connection } from 'typeorm';
import 'reflect-metadata';

export class Database {
  public static connection: Connection;

  public static userRepository: UserRepository;
  public static roleRepository: RoleRepository;
  public static permissionRepository: PermissionRepository;
  public static refreshTokenRepository: RefreshTokenRepository;
  public static languageRepository: LanguageRepository;
  public static translationRepository: TranslationRepository;
  public static categoryRepository: CategoryRepository;
  public static imageRepository: ImageRepository;
  public static itemRepository: ItemRepository;
  public static tagRepository: TagRepository;

  static async init(configs: IDbConfig): Promise<Database> {
    this.connection = await DatabaseConnection.initConnection(configs);

    this.userRepository = new UserRepository(this);
    this.roleRepository = new RoleRepository(this);
    this.permissionRepository = new PermissionRepository(this);
    this.refreshTokenRepository = new RefreshTokenRepository(this);
    this.languageRepository = new LanguageRepository(this);
    this.translationRepository = new TranslationRepository(this);
    this.categoryRepository = new CategoryRepository(this);
    this.imageRepository = new ImageRepository(this);
    this.itemRepository = new ItemRepository(this);
    this.tagRepository = new TagRepository(this);

    return this;
  }
}
