import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import { dbUsers } from "../../../../database"

//cambiamos el orden del formulario segun el orden aca
//sale errores pero funciona
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    
    // ...add more providers here
    Credentials({
      name:'Custom Login',
      credentials:{
        email:{label:'Correo',type:'email',placeholder:'tucorreo@example.com'},
        password:{label:'Contraseña',type:'password',placeholder:'contraseña'}
      },
      async authorize(credentials){
       
        return await dbUsers.checkUserEmailPassword(credentials!.email,credentials!.password);
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),

  ],

  //Custom Pages
  pages:{
    signIn:'/auth/login',
    newUser:'/auth/register'
  },
  //callbacks
  jwt:{

  },
  session:{
    maxAge: 2592000,//30d
    strategy:'jwt',
    updateAge: 86400 //se actualize cada dia
  },

  //Callbacks
  callbacks:{
    async jwt({token,account,user}){
      //console.log({account})
      if(account){
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '')
            break;
          case 'credentials':
            token.user = user;
            break;
        }
      }
      return token;
    },
    async session({session,token,user}){
      // console.log(session)
      
      session.accessToken  = token.accessToken;
      session.user = token.user as any;

      return session;//esta sesion la podre leer en cualquier parte de la app
    } 
  }
}

export default NextAuth(authOptions)