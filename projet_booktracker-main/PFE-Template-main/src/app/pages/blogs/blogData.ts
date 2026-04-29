interface blogPosts {
  id: number;
  time: string;
  imgSrc: string;
  user: string;
  title: string;
  views: string;
  category: string;
  comments: number;
  featuredPost: boolean;
  date: string;
  author: string;
  description: string;
  rating: number;
  genres:string[];
  pages:number;
  year:number;
}

export const blogPosts: blogPosts[] = [
  {
    id: 1,
    title: 'Discipline',
    author: 'Brian Tracy',
    description: 'This book teaches you how to build discipline and achieve success in life.',
    rating: 4.5,
    imgSrc: '/assets/images/blog/blog-img1.jpg',
    genres: ['Self Help', 'Motivation'],
    pages: 320,
    year: 2022,
    time: '2 mins Read',
    user: '/assets/images/profile/user-1.jpg',
    views: '9,125',
    category: 'Gadget',
    comments: 3,
    featuredPost: true,
    date: 'Mon, Dec 23',
  },

  {
    id: 2,
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'Tiny habits create big changes over time.',
    rating: 4.8,
    imgSrc: '/assets/images/blog/blog-img2.jpg',
    genres: ['Productivity', 'Psychology'],
    pages: 280,
    year: 2018,
    time: '2 mins Read',
    user: '/assets/images/profile/user-2.jpg',
    views: '9,125',
    category: 'Health',
    comments: 3,
    featuredPost: false,
    date: 'Sun, Dec 23',
  }
];
