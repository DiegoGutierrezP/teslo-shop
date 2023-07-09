import {NextFetchEvent, NextRequest, NextResponse} from 'next/server'
//import { jwt } from './utils';
import * as jose from 'jose';
import { getToken } from 'next-auth/jwt';

//ejecutado de lado del servidor
/* export async function middleware(req: NextRequest, ev:NextFetchEvent) {
    
    if (req.nextUrl.pathname.startsWith('/checkout')) {
        //const {token = ''} = req.cookies ;
        const token = req.cookies.get('token')?.value || '';
        console.log(token)
        try{
            //si el token es valido pasamos a  la pagina q se solicita
            //let isvalid = await jwt.isValidToken(token);
            // await jwt.verify(
            //     token,
            //     process.env.JWT_SECRET_SEED || ''
            // );

            await jose.jwtVerify(token,
                new TextEncoder().encode(process.env.JWT_SECRET_SEED)
            )

            //console.log(isvalid)
            return NextResponse.next();
        }catch(err){
            console.log(err)
            // return Response.redirect('/auth/login')
            const {origin, pathname} = req.nextUrl;
            //const url = req.nextUrl.clone()
            //url.pathname = `/auth/login?p=${p}`;
            return NextResponse.redirect(`${origin}/auth/login?p=${pathname}`)
        }

    }
}  */

export async function middleware(req: NextRequest, ev:NextFetchEvent) {
    
    if (req.nextUrl.pathname.startsWith('/checkout')) {
       const session = await getToken({req,secret:process.env.NEXTAUTH_SECRET}) 
        
       if(!session){
        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = '/auth/login';
        url.search = `p=${requestedPage}`;

        return NextResponse.redirect(url);

       }
      
       return NextResponse.next();
    }
} 

// Supports both a single string value or an array of matchers
export const config = {
    matcher: ['/checkout/address','/checkout/summary'],
  }