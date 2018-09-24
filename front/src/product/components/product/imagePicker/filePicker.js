import React from 'react';
import UploadIcon from '@material-ui/icons/FileUpload';

const getImage = (event) => {
    try{
        return URL.createObjectURL(event.target.files[0]);
    }catch(e){
        return null;
    }
};

export const FileInput = ({handleImageChange}) =>
    <div>
        <label htmlFor="image-picker">
            <UploadIcon className="upload-icon" />
        </label>
        <input style={{display:"none"}}
               type="file"
               name="image-picker"
               id="image-picker"
               accept="image/*"
               onChange={(e)=> handleImageChange(getImage(e))}/>
    </div>;