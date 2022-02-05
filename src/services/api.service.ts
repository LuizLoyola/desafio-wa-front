import axios from "axios";
import {Order} from "../models/order";

interface ApiResponse {
  orders: Order[];
  orderCount: number;
}

export const ApiService = {
  getData: (page: number): Promise<ApiResponse> => {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('https://desafio-wa-back.luizloyola.com.br/', {
        auth: {username: 'admin', password: '1234abcd'},
        params: {pageIndex: page}
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
