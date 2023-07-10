import { IOrder } from '@/interfaces';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../../database';
import { Order, Product } from '../../../../models';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

type Data = {
    message: string
} | IOrder

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return createOrder(req, res);
    
        default:
            res.status(400).json({ message: 'Bad request' })
    }

    
}

const  createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { orderItems, total } = req.body as IOrder;

    //verificar que tengamos un usuario
    const session : any = await getServerSession(req,res,authOptions);//EN la req van las cookies y ahi estan la sesion

    if(!session){
        return res.status(401).json({message:'Debe estar autenticado para hacer esto'})
    }

    const productsId = orderItems.map(p => p._id);
    await db.connect();

    const dbProducts = await Product.find({_id:{$in : productsId}});

    try{
        const subTotal =  orderItems.reduce((prev, current)=> {
            const currentPrice = dbProducts.find(prod => prod._id.toString() === current._id.toString())?.price;
            if(!currentPrice){
                throw new Error('Verifique el carrito de nuevo, producto no existe')
            }
            return (currentPrice * current.quantity) + prev;
        } ,0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * (taxRate + 1);
        if(total !== backendTotal){
            throw new Error('El total no cuadro con el monto');
        }

        //Todo bien hasta este punto
        const userId = session.user._id;
        const newOrder = new Order({...req.body, isPaid : false, user:userId});
        newOrder.total = Math.round(newOrder.total * 100)/100;//regresa a dos decimales
        await newOrder.save();

        return res.status(201).json(newOrder)

    }catch(err : any){
        await db.disconnect();
        console.log(err);
        res.status(400).json({
            message : err.message  || 'Revise logs del servidor'
        })
    }
    console.log(dbProducts);
    
    return res.status(201).json(session);
}
