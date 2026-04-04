export interface Comment {
  text: string;
  date: Date;
}

export interface Note {
  title: string;
  datef: Date;
  likes: number;
  comments: Comment[];
}