export interface ContentData {
  id: number;
  username: string,
  user_id: number;
  team_id: number;
  title: string;
  contents: string;
  created_datetime: Date;
  last_updated_datetime: Date;
  like: number;
  unlike: number;
  category: string;
  tags: [string];
}
