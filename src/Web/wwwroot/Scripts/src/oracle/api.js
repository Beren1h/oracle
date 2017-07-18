import axios from 'axios';


export const GetEnvelopes = () => {
    return axios({
        method: 'get',
        contentType: 'application/json',
        url: '/api/envelope/all'
    });
};



export const InsertPool = (pool, result) => {
    return axios({
        method: 'post',
        contentType: 'application/json',
        url: '/api/pool/commit',
        data: pool
    });
};

export const GetPools = () => {
    return axios({
        method: 'get',
        contentType: 'application/json',
        url: '/api/pool/all'
    });
};







export const GetPostError = (error) => {
    
    let result = {
        status: '',
        message: ''
    };

    if(error.response && error.response.data){
        result.status = error.response.status;
        result.message = error.response.data;
    } else {
        result.status = '';
        result.message = error.toString();
    }

    return result;
};

export const GetPostResult = (response) => {

    let result = {
        status: '',
        message: ''
    };

    if(response && response.status){
        result.status = response.status;
    }

    return result;
};