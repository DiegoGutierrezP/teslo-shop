import { GetServerSideProps } from 'next';
import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { AuthLayout } from "@/components/layouts"
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material"
import { useForm } from 'react-hook-form';
import { validations } from '@/utils';
import { tesloApi } from '@/api';
import { ErrorOutline } from '@mui/icons-material';
import { AuthContext } from '@/context';
import { useRouter } from 'next/router';

type FormData = {
    name: string;
    email: string,
    password: string,
};

const RegisterPage = () => {
    const router = useRouter();
    const { registerUser} = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onRegisterForm = async ({name,email,password}:FormData) => {
        setShowError(false)

        const {hasError, message} = await registerUser(name,email,password);

        if(hasError){
            setShowError(true);
            setErrorMessage(message || '')
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);

        await signIn('credentials',{email,password})
    }

  return (
    <AuthLayout title="Registrarse" >
        <form onSubmit={handleSubmit(onRegisterForm)} >
            <Box sx={{width:350, padding:'10px 20px'}}>
                <Grid container spacing={2} >
                    <Grid item>
                        <Typography variant="h1" component='h1' >Crear Cuenta</Typography>
                        <Chip
                            label='No reconocemos ese usuario / contraseña'
                            color='error'
                            icon={<ErrorOutline/>}
                            className='fadeIn'
                            sx={{display:showError ? 'flex' : 'none'}}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField 
                            label='Nombre' 
                            fullWidth 
                            variant="filled"  
                            {...register('name',{
                                required:'Este campo es requerido',
                                minLength: {value:2,message:'Minimo de 2 caracteres'} 
                            })}
                            error={!!errors.name}
                            helperText={ errors.name?.message  }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label='Correo' 
                            fullWidth 
                            variant="filled" 
                            {...register('email',{
                                required:'Este campo es requerido',
                                validate: validations.isEmail
                            })}
                            error={!!errors.email}
                            helperText={ errors.email?.message  }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            type="password" 
                            label='Contraseña' 
                            fullWidth 
                            variant="filled"  
                            {...register('password',{
                                required:'Este campo es requerido',
                                minLength: { value:6, message:'Minimo 6 caracteres' }
                            })}
                            error={!!errors.password}
                            helperText={ errors.password?.message  }
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type='submit' color="secondary" className="circular-btn" size="large" fullWidth  >
                            Crear Cuenta
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end' >
                        <NextLink href={router.query.p ? `/auth/login?p=${router.query.p.toString()}` : `/auth/login`} passHref legacyBehavior >
                            <Link underline='always'>
                                Ya tengo una cuenta
                            </Link>
                        </NextLink>
                    </Grid>

                </Grid>
            </Box>  
        </form>
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({req,query}) => {
    
    const session = await getSession({req});

    const {p = '/'} = query;

    if(session){
        return {
            redirect:{
                destination:p.toString(),
                permanent:false,
            }
        }
    }

    return {
        props: { }
    }
}

export default RegisterPage