export interface BookResponse {
  id: string;
  name: {
    ru: string;
  };
  masterVariant: {
    images: { url: string }[];
    attributes: { value: string }[];
    prices: { value: { centAmount: number } }[];
  };
}
