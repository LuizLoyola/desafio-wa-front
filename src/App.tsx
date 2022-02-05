import React, {useEffect, useState} from 'react';
import './App.css';
import {DataGrid, GridColumns} from '@mui/x-data-grid'
import {ApiService} from "./services/api.service";
import {Order} from "./models/order";
import {TextField} from "@mui/material";

const columns: GridColumns = [
  {
    headerName: 'N° Pedido',
    field: 'number',
    width: 100,
    sortable: false,
    filterable: false
  },
  {
    headerName: 'Data do Pedido',
    field: 'creationDate',
    width: 130,
    type: 'date',
    renderCell: params => {
      return new Date(params.value).toLocaleDateString('pt-BR');
    },
    sortable: false,
    filterable: false
  },
  {
    headerName: 'Data de Entrega',
    field: 'deliveryDate',
    width: 130,
    type: 'date',
    renderCell: params => {
      return params.value ? new Date(params.value).toLocaleDateString('pt-BR') : (
        <span className="text-very-light">Não entregue</span>);
    },
    sortable: false,
    filterable: false
  },
  {
    headerName: 'Valor Total',
    field: 'totalValue',
    width: 120,
    renderCell: params => {
      const value = (params.row as Order).products.reduce((acc, cur) => acc + cur.price, 0);
      return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
    },
    sortable: false,
    filterable: false
  }
];

let itemCols: GridColumns = [
  {headerName: 'Nome', field: 'name', width: 300},
  {headerName: 'Quantidade', field: 'quantity', width: 100},
  {
    headerName: 'Preço Unitário',
    field: 'price',
    width: 100,
    renderCell: params => {
      return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(params.value);
    }
  },
  {
    headerName: 'Preço Total',
    field: 'totalPrice',
    width: 100,
    renderCell: params => {
      return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(params.row.quantity * params.row.price);
    }
  }
];

function App() {

  const [orders, setOrders] = useState([] as Order[]);
  const [rowCount, setRowCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null as Order | null);

  function loadData(page: number = 0) {
    setSelectedOrder(null);
    ApiService.getData(page).then(data => {
      setOrders(data.orders.map(order => {
        return {...order, id: order.number}
      }));
      setRowCount(data.orderCount);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  return (<div className="container w-100">
    <div className="row mt-3">
      <div className="col-12">
        <h1 className="text-center">Dashboard</h1>
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        <h3>Orders</h3>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-6 col-md-12">
        <DataGrid columns={columns}
                  rows={orders}
                  autoHeight={true}
                  rowHeight={35}
                  rowsPerPageOptions={[20]}
                  pageSize={20}
                  paginationMode={'server'}
                  rowCount={rowCount}
                  onPageChange={loadData}
                  onRowClick={e => setSelectedOrder(orders.find(order => order.id === e.id) || null)}
                  disableColumnSelector={true}
                  disableColumnMenu={true}
        />
      </div>
      <div className="col-lg-6 col-md-12">
        {selectedOrder != null ? (
          <div className="row">
            <h3>Detalhes do pedido <code>#{selectedOrder.number}</code></h3>
            <div className="col-6 mt-2">
              <TextField label="Número do Pedido"
                         value={selectedOrder.number}
                         inputProps={{readOnly: true}}
                         variant={'standard'}
                         fullWidth/>
            </div>
            <div className="col-6 mt-2">
              <TextField label="Data de Criação do Pedido"
                         value={new Date(selectedOrder.creationDate).toLocaleString('pt-BR')}
                         inputProps={{readOnly: true}}
                         variant={'standard'}
                         fullWidth/>
            </div>
            <div className="col-12 mt-2">
              <TextField label="Endereço"
                         value={selectedOrder.address}
                         inputProps={{readOnly: true}}
                         variant={'standard'}
                         fullWidth/>
            </div>
            <div className="col-6 mt-2">
              <TextField label="Status"
                         value={selectedOrder.deliveryDate ? 'Entregue' : 'Não entregue'}
                         inputProps={{readOnly: true}}
                         variant={'standard'}
                         fullWidth/>
            </div>
            <div className="col-6 mt-2">
              <TextField label="Valor Total"
                         value={new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(selectedOrder.products.reduce((acc, cur) => acc + cur.price, 0))}
                         inputProps={{readOnly: true}}
                         variant={'standard'}
                         fullWidth/>
            </div>
            {selectedOrder.deliveryDate ? (
              <>
                <div className="col-6 mt-2">
                  <TextField label="Data de Entrega"
                             value={new Date(selectedOrder.deliveryDate).toLocaleString('pt-BR')}
                             inputProps={{readOnly: true}}
                             variant={'standard'}
                             fullWidth/>
                </div>
                <div className="col-6 mt-2">
                  <TextField label="Time de Entrega"
                             value={selectedOrder.deliveryTeam.name}
                             inputProps={{readOnly: true}}
                             variant={'standard'}
                             fullWidth/>
                </div>
              </>
            ) : null}

            <div className="mt-4"></div>
            <h5>Itens</h5>
            <div className="col-12">
              <DataGrid columns={itemCols}
                        rows={selectedOrder.products}
                        autoHeight={true}
                        rowHeight={35}
                        rowsPerPageOptions={[20]}
                        pageSize={20}
                        disableSelectionOnClick={false}
              />
            </div>
          </div>
        ) : (
          <h4 className="text-very-light">Selecione um pedido para ver os detalhes</h4>
        )}
      </div>
    </div>
  </div>);
}

export default App;
