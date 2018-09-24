import React from "react"
import {ImagePicker} from "./imagePicker"
import CustomInput from "./input"
import Button from "@material-ui/core/Button"

const Product = ({inputs,values,handleChange,onSubmit}) =>
    <section id="new-product">
        {inputs.map((input,key)=>
            {
                switch(input.type){
                    case "file": return <ImagePicker label={input.label} handleChange={(value)=>handleChange(input.name,value)}/>;
                    case "text": return <CustomInput label={input.label} handleChange={(value)=>handleChange(input.name,value)}/>;
                    default: return <CustomInput label={input.label} handleChange={(value)=>handleChange(input.name,value)}/>;
                }
            }
        )}
        <div>
            <Button variant="contained" onClick={onSubmit}/>
        </div>
    </section>;

export default Product;