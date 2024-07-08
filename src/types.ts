export type RowData = {
  name: string | undefined;
  link: string | undefined;
  rating: number | null;
  average: number | null;
  progress: {
    vols: number | null;
    chaps: number | null;
  };
};

export type BodyAndRowData = {
  body: HTMLDivElement;
  data: RowData;
};
