import * as actionType from "../actions/actionTypes";

const initialState = {
    data:null,
    error:null,
    commentError: null,
    productCreationError: null,
    deleteError: null,
    isLoading:false,
}

export default function reducer(state = initialState, action){
    switch (action.type) {
        case actionType.REQ_PRODUCTS:
            return {...state, isLoading: true};
        case actionType.REQ_PRODUCT_DELETE:
            return {...state, isLoading: true};
        case actionType.RECV_PRODUCTS_DATA:
            return {...state, isLoading:false, data: action.data};
        case actionType.RECV_PRODUCTS_ERROR:
            return {...state, isLoading:false, error: action.data};
        case actionType.RESET_PRODUCTS:
            return {...state, isLoading:false, data: null, error: null};
        case actionType.SEND_PRODUCT_CREATION_DATA:
            return {...state, isLoading:true};
        case actionType.RECV_PRODUCT_CREATION_DATA:
            let products = state.data.data;
            products.push(action.data.data);
            const newCollection = {'errorMessage':state.data.errorMessage,'success':state.data.success,'data':products};
            return {...state, isLoading:false, data:newCollection, productCreationError:null};
        case actionType.RECV_PRODUCT_CREATION_ERROR:
            return {...state, isLoading:false, productCreationError: action.data};
        case actionType.SEND_COMMENT_CONTENT:
            return {...state, isLoading:true};
        case actionType.RECV_COMMENT_ERROR:
            return {...state, isLoading:false, commentError: action.data};
        case actionType.RECV_COMMENT_SUCCESS:
            let index, productId = action.data.productId;
            for(let i=0; i < state.data.data.length; i++){
                console.log(i+" candidateId:"+state.data.data[i].id);
                if(state.data.data[i].id === productId){
                    index = i;
                }
            }
            console.log("productId:"+productId);

            let product = state.data.data[index];
            console.log("product:"+JSON.stringify(product));
            console.log("comment response:"+JSON.stringify(action.data));

            product.comments.push(action.data.data); 

            const newDataArray = state.data.data.slice(0,index).concat(product).concat(state.data.data.slice(index+1));
            const newData = {'errorMessage':state.data.errorMessage,'success':state.data.success,'data':newDataArray};
            return {...state, isLoading:false, data:newData, error:null};
        case actionType.RECV_PRODUCT_DELETE_DATA:
            
        case actionType.RECV_PRODUCT_DELETE_ERROR:
            return {...state, isLoading:false, deleteError: action.data};
        default:
            return state;
    }
}