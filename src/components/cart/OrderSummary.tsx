import { CartContext } from "@/context";
import { currency } from "@/utils";
import { Grid, Typography } from "@mui/material";
import { FC, useContext } from "react";

interface Props {
    orderValues? : {
        numberOfItems : number,
        subTotal : number,
        total : number,
        tax : number
    }
}

export const OrderSummary:FC<Props> = ({orderValues}) => {

    const {numberOfItems,subTotal,total,tax} = useContext(CartContext)

    const summaryValues = orderValues ? orderValues : {numberOfItems,subTotal,total,tax};



  return (
    <Grid container >
        <Grid item xs={6} sx={{mt:1}} >
            <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={6} sx={{mt:1}} display={'flex'} justifyContent={'end'}  >
            <Typography>{summaryValues.numberOfItems} {summaryValues.numberOfItems > 1 ? 'items' : 'item'}</Typography>
        </Grid>

        <Grid item xs={6} sx={{mt:1}} >
            <Typography>SubTotal</Typography>
        </Grid>
        <Grid item xs={6} sx={{mt:1}} display={'flex'} justifyContent={'end'}  >
            <Typography>{currency.format(summaryValues.subTotal)}</Typography>
        </Grid>

         <Grid item xs={6} sx={{mt:1}} >
            <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
        </Grid>
        <Grid item xs={6} sx={{mt:1}} display={'flex'} justifyContent={'end'}  >
            <Typography>{currency.format(summaryValues.tax)}</Typography>
        </Grid>

        <Grid item xs={6} sx={{mt:1}} >
            <Typography variant='subtitle1' >Total: </Typography>
        </Grid>
        <Grid item xs={6} sx={{mt:1}} display={'flex'} justifyContent={'end'}  >
            <Typography fontWeight={600} >{ currency.format(summaryValues.total) }</Typography>
        </Grid>
    </Grid>
  );
};
