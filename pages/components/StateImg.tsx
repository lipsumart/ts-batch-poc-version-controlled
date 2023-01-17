import Image from "next/image";
import { useState } from "react";

export const StateImg = ({ src }: {src: string})=>{
    const [width, setWidth] = useState(150);
    const [height, setHeight] = useState(150);
    return <Image height={height} width={width} alt=""
      src={src}
      ></Image>
}