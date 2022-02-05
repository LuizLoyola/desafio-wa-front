import {DeliveryTeam} from "./deliveryTeam";
import {Product} from "./product";

export interface Order {
  id: number;
  number: number;
  creationDate: Date;
  deliveryDate: Date;
  address: string;
  deliveryTeam: DeliveryTeam;
  products: Product[];
}
