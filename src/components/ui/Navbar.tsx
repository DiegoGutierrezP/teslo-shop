import { useContext, useMemo, useState } from "react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material"
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import { CartContext, UiContext } from "@/context"

export const Navbar = () => {
    
    const {toggleSideMenu} = useContext(UiContext);
    const {numberOfItems} = useContext(CartContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const router = useRouter();


    const category = useMemo(() => router.pathname.split('/').pop(), [router.pathname])
    
    const onSearchTerm = () => {
        if(searchTerm.trim().length === 0) return;
        router.push(`/search/${searchTerm}`)
    }

  return (
    <AppBar>
        <Toolbar>
            <NextLink href='/' passHref legacyBehavior >
                <Link display={'flex'} alignItems={'center'} >
                    <Typography variant="h6">Teslo |</Typography>
                    <Typography sx={{ml:0.5}} >Shop</Typography>
                </Link>
            </NextLink>

            <Box flex={1} ></Box>

            <Box className='fadeIn' sx={{display: isSearchVisible ? 'none' : {xs : 'none', sm:'block' } }}   >
                <NextLink href='/category/men' legacyBehavior passHref >
                    <Link>
                        <Button color={category === 'men' ? 'primary' : 'info'} >Hombres</Button>
                    </Link>
                </NextLink>
                <NextLink legacyBehavior href='/category/women' passHref >
                    <Link>
                        <Button color={category === 'women' ? 'primary' : 'info'} >Mujeres</Button>
                    </Link>
                </NextLink>
                <NextLink legacyBehavior href='/category/kid' passHref >
                    <Link>
                        <Button color={category === 'kid' ? 'primary' : 'info'} >Niños</Button>
                    </Link>
                </NextLink>
            </Box>

            <Box flex={1} ></Box>

            {/* Pantallas grandes */}
            
            {
                isSearchVisible
                    ? (
                        <Input
                            sx={{display: {xs : 'none', sm:'flex' } }}
                            className="fadeIn"
                            autoFocus
                            value={searchTerm}
                            onChange={(e)=>setSearchTerm(e.target.value)}
                            onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null}
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setIsSearchVisible(false)}
                                    >
                                        <ClearOutlined/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    ) : (
                        
                        <IconButton
                            sx={{display: {xs : 'none', sm:'flex' } }}
                            onClick={()=>setIsSearchVisible(true)}
                            className="fadeIn"
                        >
                            <SearchOutlined/>
                        </IconButton> 
                    )
            }
             

            {/* Pantallas pequenas */}
            <IconButton 
               sx={{display:{xs:'flex',sm:'none'}}} 
               onClick={toggleSideMenu}
            >
                <SearchOutlined/>
            </IconButton>

            <NextLink href='/cart' passHref legacyBehavior >
                <Link>
                    <IconButton>
                        <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color="secondary" >
                            <ShoppingCartOutlined/>
                        </Badge>
                    </IconButton>
                </Link>
            </NextLink>

            <Button onClick={toggleSideMenu}  >Menu</Button>

        </Toolbar>
    </AppBar>
)
}
