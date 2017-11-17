import axios from 'axios';

export const GetObjectId = () => {
    return axios({
        method: 'get',
        contentType: 'application/json',
        url: '/api/objectid'
    });
};

export const GetContainers = () => {
    return axios({
        method: 'get',
        contentType: 'application/json',
        url: '/api/container'
    });
};

export const GetTransaction = (id) => {
    return axios({
        method: 'get',
        contentType: 'application/json',
        url: '/api/transaction/' + id
    });
};

export const GetTransactionDole = (id) => {
    return axios({
        method: 'get',
        contentType: 'application/json',
        url: '/api/transaction/dole/' + id
    });
};

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

export const PostTransaction = (transaction) => {
    //console.log('post = ', transaction);
    return axios({
        method: 'post',
        contentType: 'application/json',
        url: '/api/transaction',
        data: transaction
    });
};

export const PutTransaction = (transaction) => {
    //console.log('put = ', transaction);
    return axios({
        method: 'put',
        contentType: 'application/json',
        url: '/api/transaction',
        data: transaction
    });
};

export const DeleteTransaction = (transaction) => {
    //console.log('delete = ', transaction);
    return axios({
        method: 'delete',
        contentType: 'application/json',
        url: '/api/transaction/' + transaction._id
    });
};

export const GetDole = (id) => {
    return axios({
        method: 'get',
        contentType: 'application/json',
        url: '/api/dole/' + id
    });
};

export const PostDole = (dole) => {
    return axios({
        method: 'post',
        contentType: 'application/json',
        url: '/api/dole',
        data: dole
    });
};

export const PutDole = (dole) => {
    return axios({
        method: 'put',
        contentType: 'application/json',
        url: '/api/dole',
        data: dole
    });
};
