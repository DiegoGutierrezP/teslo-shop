import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../../database';
import { Product } from '../../../../models';
import { IProduct } from '@/interfaces';

type Data = | { message: string } | IProduct;

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method){
        case 'GET':
            return getProductBySlug(req,res);
        default:
            return res.status(404).json({message:'Endoint not found'})
    }
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const {slug} = req.query;

    await db.connect();

    const product = await Product.findOne({slug}).lean();

    await db.disconnect();

    if(!product){
        return res.status(404).json({
            message:'Producto no encontrado'
        })
    }

    return res.status(200).json(product)
}