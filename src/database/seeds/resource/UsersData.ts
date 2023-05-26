import { UserRole } from '../../../types/enum';

export const UsersData = [
  {
    payload: {
      profilePicture: 'super_admin_icon.png',
      firstName: 'Super',
      lastName: 'Adminyan',
      email: 'super.puper@gmail.com',
      phone: '+37477777777',
      password: 'SuperPuper12#$',
      gender: 'male',
      birthDate: new Date(),
      verifiedAt: new Date(),
    },
    role: UserRole.SUPER_ADMIN,
  },
  {
    payload: {
      profilePicture: 'profile_icon.png',
      firstName: 'Admin',
      lastName: 'Adminyan',
      email: 'admin@gmail.com',
      phone: '+37433333333',
      password: 'admin1234!',
      address: 'street',
      birthDate: new Date(),
      verifiedAt: new Date(),
    },
    role: UserRole.CLIENT,
  },
  {
    payload: {
      profilePicture: 'profile_icon.png',
      firstName: 'Client',
      lastName: 'Clientyan',
      email: 'client@gmail.com',
      phone: '+37488888888',
      password: 'client1234!',
      address: 'street',
      birthDate: new Date(),
      verifiedAt: new Date(),
    },
    role: UserRole.CLIENT,
  },
];
