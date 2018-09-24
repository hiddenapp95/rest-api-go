import React from "react";
import {createStructuredSelector} from "reselect";
import {getInterviews, isLoading} from "../../selectors";
import {connect} from "react-redux";
import {routes} from "../../../routes";
import Product from "../product/index";

const NewProduct = ({dispatch}) =>
    <section id="search">
           <Product onSubmit={()=>{}}/>
    </section>;

export default connect(
    createStructuredSelector({
        isLoading: isLoading,
        interviews: getInterviews
    })
) (NewProduct)