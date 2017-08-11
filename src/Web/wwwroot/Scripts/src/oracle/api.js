import axios from 'axios';


export const GetEnvelopes = () => {
    return axios({
        method: 'get',
        contentType: 'application/json',
        url: '/api/envelope/all'
    });
};

export const GetAssignments = () => {
    return axios({
        method: 'get',
        contentType: 'application/json',
        url: '/api/assignment/all'
    });
};

export const GetAssignmentsByPoolId = (poolId) => {
    return axios({
        method: 'get',
        contentType: 'application/json',
        url: '/api/assignment/pool/' + poolId
    });
};



export const CommitAssignments = (assignments, result) => {
    console.log(assignments);
    return axios({
        method: 'post',
        contentType: 'application/json',
        url: '/api/assignment/commit',
        data: assignments
    });
};


export const CommitPool = (pool, result) => {
    console.log(pool);
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