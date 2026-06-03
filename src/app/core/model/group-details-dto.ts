export interface GroupDetailItem {
  id: string;
  tagId: string;
  order: number;
  key: string;
  tag: string;
  imgUrl: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  items: GroupDetailItem[];
}
