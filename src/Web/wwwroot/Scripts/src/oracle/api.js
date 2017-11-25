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
        return axios(GET.props).then((response) => {return response.data;});
    },
    container: () => {
        GET.props.url = route.container.baseline;
        return axios(GET.props).then((response) => {return response.data;});
    },
    dole: (id) => {
        if (id){
            GET.props.url = route.dole.baseline + '/' + id;
        } else {
            GET.props.url = route.dole.baseline;
        }
        return axios(GET.props).then((response) => {return response.data;});
        
    },
    objectId: () => {
        GET.props.url = route.objectid.baseline;
        return axios(GET.props).then((response) => {return response.data;});
    }
};
