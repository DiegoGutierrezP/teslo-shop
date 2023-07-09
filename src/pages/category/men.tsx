import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { useProducts } from '@/hooks';
import { Typography } from '@mui/material';
import React from 'react'

const MenPage = () => {
    const { products, isLoading } = useProducts('/products?gender=men');


    return (
      <ShopLayout title="Teslo Shop - Men" pageDescription={`Productos para hombres`} >
        <Typography variant="h1" >Hombres</Typography>
        <Typography variant="h2" sx={{mb:1}} >Todos los productos</Typography>
        
        {
          isLoading
           ? <FullScreenLoading/>
           : <ProductList products={products} />
        }
  
      </ShopLayout>
    )
}

export default MenPage