export type DataUnit = {
    token: { name: string; display_uri: string; timestamp: string; supply: number };
    price: number;
    seller: { address: string; alias: string;};
    amount_left: number;
    bigmap_key: number;
    marketplace_contract: string;
};
  
export type BatchUnit = {
    index: number;
    count: number;
    token: DataUnit;
    tgt: string;
};
  
export type Data = {
    listing: {
      token: { name: string; display_uri: string; timestamp: string; supply: number };
      price: number;
      seller: { address: string; alias: string; };
      amount_left: number;
      bigmap_key: number;
      marketplace_contract: string;
    } [];
};