import Image from "next/image";
import { useState } from "react";

export const StateImg = ({ src }: {src: string})=>{
    const [width, setWidth] = useState("100%");
    const [height, setHeight] = useState("100%");
    return <Image height={Number(height)} width={Number(width)} alt=""
      src={src}
      onLoadingComplete={(obj)=>{
        setWidth(obj.naturalWidth.toString());
        setHeight(obj.naturalHeight.toString());
      }
    }></Image>
}