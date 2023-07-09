import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextLink from 'next/link';
import Cookies from "js-cookie";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material"
import { CartList, OrderSummary } from "@/components/cart"
import { ShopLayout } from "@/components/layouts"
import { CartContext } from "@/context";
import { countries } from "@/utils";

const SummaryPage = () => {
    const router = useRouter();
    const {shippingAddress, numberOfItems, createOrder} = useContext(CartContext);

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
      if(!Cookies.get('firstName')){
        router.push('/checkout/address');
      }
    }, [router])
    
    const onCreateOrder = async () => {
        setIsPosting(true);

        const  {hasError, message} = await createOrder();

        if(hasError){
            setIsPosting(false);
            setErrorMessage(message)
            return;
        }

        //para no regresar aqui 
        router.replace(`/orders/${message}`)
        
    }

    if(!shippingAddress){
        return <></>
    }

    const {firstName,lastName,address,address2,city,country,phone,zip} = shippingAddress;

  return (
    <ShopLayout title="Resument de orden" pageDescription={`Resumen de la orden`} >
        <Typography variant="h1" component='h1'  >Resumen de la Orden</Typography>
        <Grid  container >
            <Grid item xs={12} sm={7} >
                <CartList />
            </Grid>
            <Grid item xs={12} sm={5} >
                <Card className="summary-card" >
                    <CardContent>
                        <Typography variant='h2' > Resumen ({numberOfItems} productos) </Typography>
                        <Divider sx={{my:1}} />

                        <Box display='flex' justifyContent={'space-between'}>
                            <Typography variant='subtitle1' >Direccion de entrega</Typography>
                            <NextLink href={`/checkout/address`} passHref legacyBehavior >
                                <Link underline="always" >
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <Typography  >{firstName} {lastName}</Typography>
                        <Typography >{address } {address2 ? `, ${address2}` : ''}</Typography>
                        <Typography >{`${city}, ${zip}`}</Typography>
                        {/* <Typography >{`${countries.find(c => c.code === country)?.name}`}</Typography> */}
                        <Typography >{country}</Typography>
                        <Typography >{`${phone}`}</Typography>

                        <Divider sx={{my:1}} />

                        <Box display='flex' justifyContent={'end'}>
                            <NextLink href={`/cart`} passHref legacyBehavior >
                                <Link underline="always" >
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <OrderSummary/>

                        <Box sx={{mt:3}} display={'flex'} flexDirection={'column'}>
                            <Button 
                                onClick={onCreateOrder}    
                                color="secondary" 
                                className="circular-btn" 
                                fullWidth  
                                disabled={isPosting}
                            >
                                Confirmar Orden
                            </Button>
                            
                            <Chip
                                color='error'
                                label={errorMessage}
                                sx={{display:errorMessage ? 'flex' : 'none',mt:5}}
                            />
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage