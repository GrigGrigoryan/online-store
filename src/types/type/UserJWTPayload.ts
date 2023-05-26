import { Role, User, Image, Permission } from '../../database/entity';

export type UserJWTPayload = {
  userId: User['id'];
  fullName: `${User['firstName']} - ${User['lastName']}`;
  profilePicture: User['profilePicture'];
  email: User['email'];
  phone: User['phone'];
  role: Role;
};
