import { ShopLayout } from "@/components/layouts";
import { Card, CardActionArea, CardMedia, Grid, Typography } from "@mui/material";
import { ProductList } from "@/components/products";
import { IProduct } from "@/interfaces";
import { useProducts } from "@/hooks";
import { FullScreenLoading } from "@/components/ui";

export default function HomePage() {
  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout title="Teslo - Shop" pageDescription={`Encuentra los mejores productos`} >
      <Typography variant="h1" >Tienda</Typography>
      <Typography variant="h2" sx={{mb:1}} >Todos los productos</Typography>
      {
        isLoading
         ? <FullScreenLoading/>
         : <ProductList products={products} />
      }
    </ShopLayout>
  )
}
