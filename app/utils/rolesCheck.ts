import { TUser } from 'app/Types';

export const getRoles = (userData: TUser) => {
  let roles: any[] = [];
  if (userData) {
    userData.user.forEach(user => {
      if (user.roles) {
        roles = user.roles;
      } 
    });
  }
  return roles;
};
