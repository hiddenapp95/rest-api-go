import React from 'react';
import Preview from "./preview";

export const ImagePicker = ({handleImageChange,image}) => <Preview handleImageChange={handleImageChange} image={image}/>

export default ImagePicker;