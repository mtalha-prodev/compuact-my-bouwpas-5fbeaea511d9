type TCategory = {
  id: number;
  name: string;
  isMain: boolean;
  books: TBooklet[];
};

export type TBooklet = {
  id: number;
  title: string;
  author: string;
  image: null | string;
  crc: number;
  chapters: number;
};

export type TBookletsList = TCategory[];
