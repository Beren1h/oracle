import axios from 'axios';

const props = {
    baseline: {
        contentType: 'application/json',
        url: '/api'
    },
    get: () => {
        props.baseline.method = 'get';
        return props.baseline; 
    },
    put: () => {
        props.baseline.method = 'put';
        return props.baseline; 
    },
    post: () => {
        props.baseline.method = 'post';
        return props.baseline; 
    },
    delete: () => {
        props.baseline.method = 'delete';
        return props.baseline;
    }    
};

const route = {
    transaction: {
        baseline: '/api/transaction',
        dole: '/api/transaction/dole',
        container: '/api/transaction/container'
    },
    container: {
        baseline: '/api/container'
    },
    dole: {
        baseline: '/api/dole'
    },
    objectid: {
        baseline: '/api/objectid'
    }
};

export const DELETE = {
    props: Object.assign({}, props.delete()),
    transaction: (document) => {
        DELETE.props.url = route.transaction.baseline + '/' + document._id;
        return axios(DELETE.props);
    }
};

export const POST = {
    props: Object.assign({}, props.post()),
    transaction: (document) => {
        POST.props.url = route.transaction.baseline;
        POST.props.data = document;
        return axios(POST.props);
    },
    dole: (document) => {
        POST.props.url = route.dole.baseline;
        POST.props.data = document;
        return axios(POST.props);
    }    
};

export const PUT = {
    props: Object.assign({}, props.put()),
    transaction: (document) => {
        PUT.props.url = route.transaction.baseline;
        PUT.props.data = document;
        //console.log('PUT = ', PUT.props, document);
        return axios(PUT.props);
    },
    dole: (document) => {
        PUT.props.url = route.dole.baseline;
        PUT.props.data = document;
        return axios(PUT.props);
    }    
};

export const GET = {
    props: Object.assign({}, props.get()),
    transaction: (id, by) => {
        switch(by){
        case ('dole'):
            GET.props.url = route.transaction.dole + '/' + id;
            break;
        case 'container':
            GET.props.url = route.transaction.container + '/' + id;
            break;            
        default:
            GET.props.url = route.transaction.baseline + '/' + id;
        }
        //return axios(GET.props);
        return axios(GET.props).then((response) => {return response.data;});
    },
    container: () => {
        GET.props.url = route.container.baseline;
        return axios(GET.props).then((response) => {return response.data;});
        //return axios(GET.props);
    },
    dole: (id) => {
        if (id){
            GET.props.url = route.dole.baseline + '/' + id;
        } else {
            GET.props.url = route.dole.baseline;
        }
        //return axios(GET.props);
        return axios(GET.props).then((response) => {return response.data;});
        
    },
    objectId: () => {
        GET.props.url = route.objectid.baseline;
        //return axios(GET.props);
        return axios(GET.props).then((response) => {return response.data;});
    }
};


// export const GetObjectId = () => {
//     return axios({
//         method: 'get',
//         contentType: 'application/json',
//         url: '/api/objectid'
//     });
// };

// export const GetContainers = () => {
//     return axios({
//         method: 'get',
//         contentType: 'application/json',
//         url: '/api/container'
//     });
// };

// export const GetTransaction = (id) => {
//     return axios({
//         method: 'get',
//         contentType: 'application/json',
//         url: '/api/transaction/' + id
//     });
// };

// export const GetTransactionDole = (id) => {
//     return axios({
//         method: 'get',
//         contentType: 'application/json',
//         url: '/api/transaction/dole/' + id
//     });
// };

// export const Get = {
//     method: 'get',
//     type: 'application/json',
//     transaction: {
//         url: '/api/transaction/',
//         dole: (id) => {
//             return axios({
//                 method: Get.method,
//                 contentType: Get.type,
//                 url: transaction.url + 'dole/' + id
//             });
//         },
//         envelope: (id) => {
//             return Get.method;
//         }
//     }
// };


// export const GetTransaction = (id, by) => {

//     const props = {
//         method: 'get',
//         contentType: 'application/json',
//         url: '/api/transaction/'
//     };

//     switch(by){
//     case 'dole':
//         props.url += 'dole/' + id;
//         break;
//     case 'envelope':
//         props.url += 'envelope/' + id;
//     default:
//         props.url += id;
//     }

//     return axios(props);
// };



// export const PutTransactionPair = (transaction0, transaction1) => {
//     console.log('put = ', transaction0, transaction1);
//     return axios({
//         method: 'put',
//         contentType: 'application/json',
//         url: '/api/transaction/pair',
//         data: [transaction0, transaction1]
//     });
// };

// export const PostTransactionPair = (transaction0, transaction1) => {
//     console.log('post = ', transaction0, transaction1);
//     return axios({
//         method: 'post',
//         contentType: 'application/json',
//         url: '/api/transaction/pair',
//         data: [transaction0, transaction1]
//     });
// }; 

// export const DeleteTransactionPair = (transaction0, transaction1) => {
//     console.log('delete = ', transaction0, transaction1);
//     return axios({
//         method: 'delete',
//         contentType: 'application/json',
//         url: '/api/transaction/pair/' + transaction0._id + '/' + transaction1._id
//     });
// };

// export const PostTransaction = (transaction) => {
//     //console.log('post = ', transaction);
//     return axios({
//         method: 'post',
//         contentType: 'application/json',
//         url: '/api/transaction',
//         data: transaction
//     });
// };

// export const PutTransaction = (transaction) => {
//     //console.log('put = ', transaction);
//     return axios({
//         method: 'put',
//         contentType: 'application/json',
//         url: '/api/transaction',
//         data: transaction
//     });
// };

// export const DeleteTransaction = (transaction) => {
//     //console.log('delete = ', transaction);
//     return axios({
//         method: 'delete',
//         contentType: 'application/json',
//         url: '/api/transaction/' + transaction._id
//     });
// };

// export const GetDole = (id) => {
//     return axios({
//         method: 'get',
//         contentType: 'application/json',
//         url: '/api/dole/' + id
//     });
// };

// export const PostDole = (dole) => {
//     return axios({
//         method: 'post',
//         contentType: 'application/json',
//         url: '/api/dole',
//         data: dole
//     });
// };

// export const PutDole = (dole) => {
//     return axios({
//         method: 'put',
//         contentType: 'application/json',
//         url: '/api/dole',
//         data: dole
//     });
// };
