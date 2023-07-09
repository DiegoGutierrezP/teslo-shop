import { ShopLayout } from "@/components/layouts"
import { CartContext } from "@/context";
import { countries, jwt } from "@/utils"
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { error } from "console";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = {
    firstName:string;
    lastName : string;
    address : string;
    address2 : string;
    zip:string;
    city:string;
    country:string;
    phone:string;
}

const getAddressFromCookies = ():FormData => {
    return {
        firstName : Cookie.get('firstName') || '',
        lastName : Cookie.get('lastName') || '',
        address : Cookie.get('address') || '',
        address2 : Cookie.get('address2') || '',
        zip : Cookie.get('zip') || '',
        city : Cookie.get('city') || '',
        country : Cookie.get('country') || '',
        phone : Cookie.get('phone') || '',
    }
}

const AddressPage = () => {
    const {updateAddress} = useContext(CartContext)
    const router = useRouter();
    const {register, handleSubmit, formState:{errors}, reset} = useForm<FormData>({
        defaultValues:{
            firstName : '',
            lastName : '',
            address : '',
            address2 : '',
            zip : '',
            city : '',
            country : countries[0].code,
            phone : '',
        }
    });

    useEffect(() => {
        reset(getAddressFromCookies())
    }, [reset])
    

    const onSubmitAddress = (data : FormData) => {
        updateAddress(data);
        router.push('/checkout/summary')
    }

  return (
    <ShopLayout title="Direccion" pageDescription="Confirmar direccion de destino" >
            <form onSubmit={handleSubmit(onSubmitAddress)} >
                <Typography variant="h1" component='h1' >Direccion</Typography>

                <Grid container spacing={2} >
                    <Grid item xs={12} sm={6} sx={{mt:2}} >
                        <TextField 
                            label='Nombre' 
                            variant="filled" 
                            fullWidth 
                            {
                                ...register('firstName', {
                                    required:'Este campo es requerido',
                                    minLength:{value:6, message:'Minimo 6 caracteres'} 
                                })
                            }
                            error={ !!errors.firstName }
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{mt:2}} >
                        <TextField 
                            label='Apellido' 
                            variant="filled" 
                            fullWidth
                            {
                                ...register('lastName', {
                                    required:'Este campo es requerido',
                                    minLength:{value:6, message:'Minimo 6 caracteres'} 
                                })
                            }
                            error={ !!errors.lastName }
                            helperText={errors.lastName?.message}
                         />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField 
                            label='Dirección' 
                            variant="filled" 
                            fullWidth
                            {
                                ...register('address', {
                                    required:'Este campo es requerido',
                                    minLength:{value:6, message:'Minimo 6 caracteres'} 
                                })
                            }
                            error={ !!errors.address }
                            helperText={errors.address?.message} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField 
                            label='Dirección 2' 
                            variant="filled" 
                            fullWidth 
                            {
                                ...register('address2')
                            }
                            error={ !!errors.address2 }
                            helperText={errors.address2?.message} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField 
                            label='Codigo Postal' 
                            variant="filled" 
                            fullWidth 
                            {
                                ...register('zip', {
                                    required:'Este campo es requerido',
                                    minLength:{value:6, message:'Minimo 6 caracteres'} 
                                })
                            }
                            error={ !!errors.zip }
                            helperText={errors.zip?.message} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField 
                            label='Ciudad' 
                            variant="filled" 
                            fullWidth 
                            {
                                ...register('city', {
                                    required:'Este campo es requerido',
                                    minLength:{value:6, message:'Minimo 6 caracteres'} 
                                })
                            }
                            error={ !!errors.city }
                            helperText={errors.city?.message} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <FormControl fullWidth  >
                            <TextField
                                // select
                                variant="filled"
                                label='Pais'
                                fullWidth
                                // defaultValue={ Cookie.get('country') || countries[0].code}
                                //value={'CRI'}
                                {
                                    ...register('country', {
                                        required:'Este campo es requerido',
                                    })
                                }
                                error={ !!errors.country }
                                helperText={errors.country?.message} 
                            />
                                {/* {
                                    countries.map(c => (
                                        <MenuItem key={c.code} value={c.code} >{c.name}</MenuItem>
                                    ))
                                }
                            </TextField> */}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField 
                            label='Telefono' 
                            variant="filled" 
                            fullWidth 
                            {
                                ...register('phone', {
                                    required:'Este campo es requerido',
                                    minLength:{value:6, message:'Minimo 6 caracteres'} 
                                })
                            }
                            error={ !!errors.phone }
                            helperText={errors.phone?.message} 
                        />
                    </Grid>
                </Grid>

                <Box sx={{mt:5}} display='flex' justifyContent={'center'} >
                    <Button  type="submit" color="secondary" className="circular-btn" size="large" >
                        Revisar pedido
                    </Button>
                </Box>
            </form>
    </ShopLayout>
    )

}


//ejecuta esta funcion antes de montar el componente
// export const getServerSideProps: GetServerSideProps = async ({req}) => {
  
//   const {token = ''} = req.cookies;
//   let isValidToken = false;

//   try{
//     await jwt.isValidToken(token);
//     isValidToken = true;
//   }catch(err){
//     isValidToken = false;
//   }

//   if(!isValidToken){
//     return {
//         redirect:{
//             destination:'/auth/login?p=/checkout/address',
//             permanent:false
//         }
//     }
//   }

//     return {
//         props: {}
//     }
// }


export default AddressPage