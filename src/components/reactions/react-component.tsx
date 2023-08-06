import { Variants, motion } from 'framer-motion'
import { SmilePlusIcon } from 'lucide-react'
import { useState } from 'react'
import REACTION_CHOICES from './reactiontypes'
import { buttonVariants } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'



const ReactComponent = ({ onIconSelect }: { onIconSelect: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, icon: string) => void }) => {
    const handleIconSelect = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, icon: string) => {
        // Call the callback function with the selected icon
        onIconSelect(event, icon);
        // Close the container if desired
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    className='z-[999]'
                >
                    <SmilePlusIcon />
                </motion.button>
            </PopoverTrigger>
            <PopoverContent title="choose reaction" align='start' className="z-[999] origin-center flex flex-row flex-wrap justify-between items-stretch gap-1 p-2 max-w-[280px]">
                {REACTION_CHOICES.map(icon => (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        key={icon?.label}
                        className={buttonVariants({ variant: "ghost", size: "icon", className: "h-9 w-9 text-xl" })}
                        onClick={(event) => handleIconSelect(event, icon?.value)}
                    >
                        {icon?.value}
                    </motion.button>
                ))}
            </PopoverContent>
        </Popover>
    );
}

export default ReactComponent;