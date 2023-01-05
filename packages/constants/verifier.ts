import { LoginType } from "@portkey/types/types-ca/wallet";


export const LOGIN_TYPE_LABEL_MAP: { [key in LoginType]: string } = {
  [LoginType.email]: 'Email',
  [LoginType.phone]: 'Phone',
};

export const LOGIN_TYPE_LIST = [
  {
    value: LoginType.email,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.email],
  },
  // {
  //   value: LoginType.phone,
  //   name: LOGIN_TYPE_LABEL_MAP[LoginType.phone],
  // },
];
