import React from 'react';
import {FileInput} from "./filePicker";

const Preview = ({image,handleImageChange}) =>
    <div id="preview-image-container" className={image? "":"error-image"}>
        {image? <img src={image} className="image" alt={""} />:null}
        <FileInput handleImageChange={handleImageChange}/>
    </div>;

export default Preview
