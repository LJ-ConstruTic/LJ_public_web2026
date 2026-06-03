export interface CreateContactRequest {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface CreateContactResponse {
  id: string;
  createdAt: string; // ISO date: "YYYY-MM-DD"
}

export interface ContactItem {
  idx: string;
  name: string;
  photo: string;
  mail: string;
  message: string;
}

export interface GetAllContactsResponse {
  size: number;
  items: ContactItem[];
}

export interface ContactDetail {
  id: string;
  idx: number;
  name: string;
  photo: string;
  mail: string;
  message: string;
}