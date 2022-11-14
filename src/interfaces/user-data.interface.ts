export interface UserData {
  username: string;
  password: string;
  email: string;
  avatar: string;
  introduction: string;
  created_datetime: Date;
  site: string;
  friends: [string];
  field: string;
}
