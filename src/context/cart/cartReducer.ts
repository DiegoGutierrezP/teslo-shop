import { ICartProduct, IProduct, ShippingAddress } from '@/interfaces';
import { CartState } from './';

type CartActionType =
| { type:'[Cart] - LoadCart from cookies | storage',payload:ICartProduct[] }
| { type:'[Cart] - Update Products in cart' ,payload:ICartProduct[] }
| { type:'[Cart] - Change cart quantity' ,payload:ICartProduct }
| { type:'[Cart] - Remove product in cart' ,payload:ICartProduct }
| { type:'[Cart] - LoadAddress from Cookies' ,payload:ShippingAddress }
| { type:'[Cart] - Update Address' ,payload:ShippingAddress }
| { 
   type:'[Cart] - Update order summary' ,
   payload:{
      numberOfItems : number,
      subTotal : number,
      tax: number,
      total:number
  } 
}
| { type:'[Cart] - Order complete' }


export const cartReducer = (state:CartState,action:CartActionType):CartState => {
   switch (action.type) {
       case '[Cart] - LoadCart from cookies | storage':
          return {
            ...state,
            isLoaded:true,
            cart : [...action.payload]
          };
      case '[Cart] - Update Products in cart':
          return {
            ...state,
             cart : [...action.payload]
          };
      case '[Cart] - Change cart quantity':
          return {
            ...state,
             cart : state.cart.map(product => {
                  if(product._id !== action.payload._id) return product;
                  if(product.size !== action.payload.size) return product;
                  return action.payload;
               })
          };
      case '[Cart] - Remove product in cart':
          return {
            ...state,
             cart : state.cart.filter(p => !(p._id === action.payload._id && p.size === action.payload.size))
          };
      case '[Cart] - Update order summary':
          return {
            ...state,
             ...action.payload
          };   
      case '[Cart] - LoadAddress from Cookies':
      case '[Cart] - Update Address':
          return {
            ...state,
             shippingAddress: action.payload
          };  
      case '[Cart] - Order complete':
        return {
          ...state,
          cart:[],
          numberOfItems: 0,
          subTotal: 0,
          tax: 0,
          total : 0
        }; 

       default:
           return state;
   }
}