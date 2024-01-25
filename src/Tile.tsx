
type TileProps = {
    color:string
}

export default function Tile(props: TileProps) {
    return <div style={{backgroundColor:props.color, width:128, height:128, display:'flex', justifyContent:'center', alignItems:'center'}}>
        {props.color}
    </div>
}