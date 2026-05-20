import type { Timestamp } from 'firebase/firestore';

export type BlogPost = {
  id: string;
  uid: string;
  title: string;
  body: string;
  image: string;
  tags: string[];
  createdBy: string;
  createdAt: Timestamp;
};

export type BlogPostInput = Omit<BlogPost, 'id' | 'createdAt'> & {
  createdAt?: Timestamp;
};
