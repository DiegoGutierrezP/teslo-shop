import { GetServerSideProps, NextPage } from 'next'
import { ShopLayout } from "@/components/layouts"
import NextLink from 'next/link';
import { Chip, Grid, Link, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import { getSession } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import { dbOrders } from '../../../database';
import { IOrder } from '@/interfaces';

const columns: GridColDef[] = [
    {field:'id',headerName:'ID',width:100},
    {field:'fullname',headerName:'Nombre Completo',width:300},
    {
        field:'paid',
        headerName:'Pagada',
        description:'Muestra informacion si esta pagada la orden o no',
        width:200,
        renderCell: (params) => {
            return (
                params.row.paid ?
                    <Chip color='success' label='Pagada' variant='outlined'  /> :
                    <Chip color='error' label='No Pagada' variant='outlined'  />
            )
        }
    },
    {
        field:'orden',
        headerName:'Ver orden',
        width:200,
        sortable:false,
        renderCell: (params) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior >
                    <Link underline='always' >
                        Ver Orden
                    </Link>
                </NextLink>
            )
        }
    }
];

interface Props {
    orders : IOrder[]
}

const HistoryPage : NextPage<Props> = ({orders}) => {

    const rows = orders.map((order,idx) => ({
        id : idx + 1,
        paid : order.isPaid,
        fullname : `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId : order._id
    }))

  return (
    <ShopLayout title="Historial de ordenes" pageDescription="Historial de ordenes" >
        <Typography variant='h1'>Historial de ordenes</Typography>
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{height:650,width:'100%'}}>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    //pageSizeOptions={ 10 }
                    //rowsPerPageOption={[10]}
                    autoHeight
                />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({req}) => {
    
    const session : any = await getSession({req});

    if(!session){
        return {
             redirect:{
                destination:'/auth/login/?p=/orders/history',
                permanent:false
             }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id);


    return {
        props: {
            orders   
        }
    }
}

export default HistoryPage