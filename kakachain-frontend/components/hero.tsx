import { Badge, Box, Button, Card, Container, Heading, Paragraph } from "theme-ui"
import { bgURL } from "../lib/constants"

export const Hero = (props: {headerData: {currentPrompt: string, currentBlock: string, totalMints: string}})=> {
    const {
        currentPrompt,
        currentBlock,
        totalMints
    } = props.headerData;

    return (
    <>    
    <Box sx={{width:"100%", backgroundColor:"wheat" ,height:"400px", backgroundImage:`url("${bgURL}")`, backgroundSize:"cover", backgroundPosition:"center"}} >
    </Box>
    <Container>
    <Heading sx={{textAlign:"center", pt: [4], fontSize:[7]}} >
        KaKa-Chain
    </Heading>
    <Paragraph sx={{textAlign:"center", my:[3]}} >
        Experimental app-chain, made with Madara stack, to explore the possibilities of the modular blockchains 🚀
    </Paragraph >
    <Badge sx={{fontSize:[3]}} >
        Latest Block: {currentBlock}
    </Badge>
    <Badge sx={{fontSize:[3], mx:[3]}} >
        Total Mints: {totalMints}
    </Badge>
    <Badge sx={{fontSize:[3], bg:"greenDark"}} >
        Mint Time: 5 minutes/mint
    </Badge>
    <Card sx={{maxWidth:[700], p:[3], mt:[4]}} >
        <Heading sx={{textAlign:"center", mb:[3]}} >
        Current Prompt:
        </Heading>
        
         {currentPrompt}
    </Card>

</Container>
</>
    )
}