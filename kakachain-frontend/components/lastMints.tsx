import { FunctionComponent } from "react"
import { Badge, Button, Card, Container, Flex, Heading, Paragraph } from "theme-ui"

export const LastMints = (props: {recentMints: Array<{
    tokenID: string,
    imgURL: string,
    txnHash: string,
    prompt: string,
}>, showAll:boolean}) => {
    return <>
    <Heading sx={{textAlign:"center", my:[4]}} >
        {!props.showAll ? "Last Mints:" : "All Mints:"}
    </Heading>

    <Container sx={{textAlign:"center"}}>
    {
    !(props.showAll)?  <Button sx={{bg:"green", textAlign:"center", mx:["auto"], cursor:"pointer"}} onClick={()=>{
        window.open("./mints", "_blank")
    }} >
        See all Mints 🖱️
    </Button>
    :<></>
    }
    </Container>

    <Flex sx={{justifyContent:"center",flexWrap:"wrap", px:[5]}} >
    {
    props.recentMints.map((mint)=>{
            return <MintCards key={mint.prompt} {...mint} />
    })}
    </Flex>
    </>
}

const MintCards: FunctionComponent<{
        tokenID: string,
        imgURL: string,
        txnHash: string,
        prompt: string,
}> = (
    props:{
        tokenID: string,
        imgURL: string,
        txnHash: string,
        prompt: string,
    } 
) => {
    const {tokenID, imgURL, txnHash, prompt} = props; 
    
    return <Card sx={{px: [3], m:[3], maxWidth:[350] }}>
        <img src={imgURL} width={"300px"} />
        <Badge> tokenID: {tokenID} </Badge> 
        <Paragraph sx={{my:[3]}} >
                <b>Prompt</b>: {prompt}
        </Paragraph>
    </Card>
}