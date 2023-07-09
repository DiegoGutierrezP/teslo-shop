import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import { db } from '../../../../database';
import { User } from '../../../../models';
import { jwt } from '@/utils';

type Data = 
| { message: string } 
| { 
    token:string, 
    user :{
        email:string,
        name:string,
        role:string,
    } 
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){
        case 'GET':
            return checkJWT(req,res);
        default:
            res.status(400).json({ 
                message: 'Bad request' 
            })
    }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    // const {token = ''} = req.body;
    const { token = '' } = req.cookies;

    let userId = '';

    try{
        userId = await jwt.isValidToken(token.toString());
    }catch(err){
        return res.status(401).json({
            message:'Token de autorizacion no es valido'
        })
    }

    await db.connect();
    const user = await User.findById(userId).lean();

    if(!user){
        return res.status(400).json({message:'No existe usuario con ese id'});
    }

    const {_id,email,role,name} = user;

    return res.status(200).json({
        token:jwt.signToken(_id,email),
        user:{
            email,
            role,
            name
        }
    })

    // await db.connect();

    // await db.disconnect();

    // if(!user){
    //     return res.status(400).json({message:'Correo o contraseña no validos - EMAIL'})
    // }

    // if(!bcrypt.compareSync(password, user.password! )){
    //     return res.status(400).json({message:'Correo o contraseña no validos - Password'})
    // }

    // const { role,name,_id} = user;

    // const token = jwt.signToken(_id,email);

    // return res.status(200).json({
    //     token,
    //     user:{
    //         email,role,name
    //     }
    // })
}
