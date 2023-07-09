import { ISize } from "@/interfaces";
import { Box, Button } from "@mui/material";
import { FC } from "react";

interface Props {
    selectedSize?: ISize;
    sizes: ISize[];
    onSelectedSize : (size:ISize) => void;
}

export const SizeSelector:FC<Props> = ({selectedSize,sizes,onSelectedSize}) => {
  return (
    <Box>
        {
            sizes.map(size => (
                <Button
                    onClick={() => onSelectedSize(size)}
                    key={size}
                    size="small"
                    color={selectedSize === size ? 'primary' : 'info' }
                >
                    {size}
                </Button>
            ))
        }
    </Box>

  )
}
