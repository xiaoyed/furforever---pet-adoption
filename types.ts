
export type Gender = 'male' | 'female';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: Gender;
  location: string;
  distance: string;
  image: string;
  category: 'dog' | 'cat' | 'other';
  description: string;
  vaccinated: boolean;
  neutered: boolean;
  status: 'available' | 'adopted' | 'pending';
  tags: string[];
  gallery: string[];
}

export interface Shelter {
  id: string;
  name: string;
  avatar: string;
  publishedCount: number;
}

export interface Application {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  status: '审核中' | '已通过' | '未通过';
  date: string;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: 'system' | 'chat';
}

export type AppScreen = 'welcome' | 'discovery' | 'favorites' | 'messages' | 'detail' | 'form' | 'profile';
