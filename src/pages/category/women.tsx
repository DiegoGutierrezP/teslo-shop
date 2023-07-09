import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";

const WomenPage = () => {
    const { products, isLoading } = useProducts('/products?gender=women');


    return (
      <ShopLayout title="Teslo Shop - Womes" pageDescription={`Productos para mujeres`} >
        <Typography variant="h1" >Mujeres</Typography>
        <Typography variant="h2" sx={{mb:1}} >Todos los productos</Typography>
        
        {
          isLoading
           ? <FullScreenLoading/>
           : <ProductList products={products} />
        }
  
      </ShopLayout>
    )
}

export default WomenPage