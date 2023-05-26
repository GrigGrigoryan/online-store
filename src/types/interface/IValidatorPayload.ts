import { NumberSchema, StringSchema, BooleanSchema, ObjectSchema, ArraySchema, DateSchema } from 'joi';

export interface ILanguagePayload {
  isDefault: BooleanSchema;
  code: StringSchema;
  label: StringSchema;
  shortCode: StringSchema;
}

export interface IRolePayload {
  name: StringSchema;
  permissionIds: ArraySchema;
}

export interface IPermissionPayload {
  name: StringSchema;
  roleIds: ArraySchema;
}
export interface ITranslationPayload {
  languageId: StringSchema;
  value: StringSchema;
  key: StringSchema;
}

export interface IUserPayload {
  firstName: StringSchema;
  lastName: StringSchema;
  gender: StringSchema;
  phone: StringSchema;
  birthDate: DateSchema;
  email: StringSchema;
  blockedAt?: DateSchema;
  rating: StringSchema;
  signature: StringSchema;
  roleId: StringSchema;
  password: StringSchema;
}

export interface ICategoryPayload {
  name: StringSchema;
  description: StringSchema;
  parentCategoryId: StringSchema;
  subCategoryIds: ArraySchema;
  isPublic: BooleanSchema;
}

export interface IItemPayload {
  name: StringSchema;
  description: StringSchema;
  price: NumberSchema;
  quantity: NumberSchema;
  categoryId: StringSchema;
  tagIds: ArraySchema;
}

export interface ITagPayload {
  name: StringSchema;
}
