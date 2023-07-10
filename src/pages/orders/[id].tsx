import { GetServerSideProps, NextPage } from 'next'
import { CartList, OrderSummary } from "@/components/cart"
import { ShopLayout } from "@/components/layouts"
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from "@mui/material"
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../../database';
import { IOrder } from '@/interfaces';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';
import { tesloApi } from '@/api';
import { useState } from 'react';

export type OrderResponseBody = {
    id:string,
    status:
        | 'COMPLETED'
        | 'SAVED'
        | 'APPROVED'
        | 'VOIDED'
        | 'PAYER_ACTION_REQUIRED'
        | 'CREATED'
}

interface Props {
    order: IOrder
}

const OrderPage: NextPage<Props> = ({order}) => {
    const [isPaying, setIsPaying] = useState(false)
    const {shippingAddress} = order;
    const router = useRouter();

    const onOrderCompleted = async (details : OrderResponseBody) => {
        if(details.status !== 'COMPLETED'){
            return alert('No hay pago de paypal');
        }
        setIsPaying(true);
        try{
            const {data} = await tesloApi.post(`/orders/pay`,{
                transactionId : details.id,
                orderId : order._id
            })

            router.reload();
        }catch(err){
            console.log(err)
            alert('Error');
        }finally{
            setIsPaying(false);
        }
    }

  return (
    <ShopLayout title={`Resumen de la orden ${order._id}`} pageDescription={`Resumen de la orden`} >
        <Typography variant="h1" component='h1'  >Orden: {order._id}</Typography>
        
        {
            order.isPaid 
            ? (
                <Chip 
                    sx={{my:2}} 
                    label='Orden ya fue pagada'
                    variant="outlined"
                    color='success'
                    icon={<CreditScoreOutlined/>}
                />     
            ):(
                <Chip 
                    sx={{my:2}} 
                    label='Pendiente de pago'
                    variant="outlined"
                    color='error'
                    icon={<CreditCardOffOutlined/>}
                />
            )
        }
        

        <Grid  container >
            <Grid item xs={12} sm={7} >
                <CartList products={order.orderItems} />
            </Grid>
            <Grid item xs={12} sm={5} >
                <Card className="summary-card" >
                    <CardContent>
                        <Typography variant='h2' > Resumen ({order.numberOfItems} productos) </Typography>
                        <Divider sx={{my:1}} />

                        <Box display='flex' justifyContent={'space-between'}>
                            <Typography variant='subtitle1' >Direccion de entrega</Typography>
                         
                        </Box>

                        <Typography  >{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                        <Typography >{shippingAddress.address} {shippingAddress.address2 && `, ${shippingAddress.address2}`}</Typography>
                        <Typography >{shippingAddress.city} {shippingAddress.zip}</Typography>
                        <Typography >{shippingAddress.country}</Typography>
                        <Typography >{shippingAddress.phone}</Typography>

                        <Divider sx={{my:1}} />

                        <Box display='flex' justifyContent={'end'}>
                            <NextLink href={`/cart`} passHref legacyBehavior >
                                <Link underline="always" >
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <OrderSummary 
                            orderValues={{
                                numberOfItems : order.numberOfItems,
                                subTotal : order.subTotal,
                                total : order.total,
                                tax : order.tax,
                            }} 
                        />

                        <Box sx={{mt:3}} display='flex' flexDirection='column'>
                            
                            <Box sx={{display:isPaying ? 'flex' : 'none'}} display={'flex'} justifyContent={'center'} className='fadeIn'>
                                <CircularProgress/>
                            </Box>
                            <Box flexDirection={'column'} sx={{display:!isPaying ? 'flex' : 'none', flex:1}} >
                            {
                                order.isPaid ? (
                                    <Chip 
                                        sx={{my:2}} 
                                        label='Orden ya fue pagada'
                                        variant="outlined"
                                        color='success'
                                        icon={<CreditScoreOutlined/>}
                                    />
                                ) : (
                                    <PayPalButtons
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            value: `${order.total}`,
                                                        },
                                                    },
                                                ],
                                            });
                                        }}
                                        onApprove={(data, actions) => {
                                            return actions.order!.capture().then((details) => {
                                                onOrderCompleted(details);
                                                // console.log({details});
                                                // const name = details.payer.name!.given_name;
                                                //alert(`Transaction completed by ${name}`);
                                            });
                                        }}
                                    />
                                )
                            }
                            </Box>
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({req,query}) => {
   
    const { id = ''} = query;
    const session:any = await getSession({req});

    if(!session){
        return { 
            redirect: {
                destination: `/auth/login/?p=/orders/${id}`,
                permanent:false //para bots de google
            }
         }
    }

    const order = await dbOrders.getOrderById(id.toString());

    if(!order){
        return {
            redirect:{
                destination: `/orders/history`,
                permanent:false //para bots de google
            }
        }
    }

    if(order.user !== session.user._id){
        return {
            redirect:{
                destination: `/orders/history`,
                permanent:false //para bots de google
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage