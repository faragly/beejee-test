import {
    LOADING,
    PAGINATE,
    LOGIN_LOADING,
    CREATE_LOADING,
    EDIT_LOADING,
    SET_LOGIN_DIALOG,
    SET_CREATE_DIALOG,
    SUCCESS_LOGIN,
    SUCCESS_LOGOUT,
    SUCCESS_CREATE,
    SUCCESS_EDIT,
    FAILED_LOGIN,
    FAILED_CREATE,
    FAILED_EDIT,
    FILTER_TASKS,
    RECEIVE_TASKS,
    FAILED_TASKS
} from './actions';

const initialState = {
    isFetching: false,
    data: {
        tasks: []
    },
    error: null,
    page: 1,
    filterParams: {},
    auth: {
        isOpen: false,
        isLoading: false,
        isAdmin: false,
        isAuthorized: false,
        token: null,
        errors: {}
    },
    create: {
        isOpen: false,
        isLoading: false,
        errors: {}
    },
    edit: {
        id: null,
        isLoading: false,
        error: null
    }
};

function rootReducer(state = initialState, {type, payload}) {
    switch (type) {
        case LOADING:
            return {...state, isFetching: true};
        case PAGINATE:
            return {...state, page: payload};
        case SET_LOGIN_DIALOG:
            return {...state, auth: {...state.auth, isOpen: payload}};
        case SET_CREATE_DIALOG:
            return {...state, create: {...state.create, isOpen: payload}};
        case LOGIN_LOADING:
            return {...state, auth: {...state.auth, isLoading: true}};
        case CREATE_LOADING:
            return {...state, create: {...state.create, isLoading: true}};
        case EDIT_LOADING:
            return {...state, edit: {...state.edit, isLoading: true, id: payload}};
        case SUCCESS_LOGIN:
            return {...state, auth: {...state.auth, isLoading: false, isAuthorized: true, isAdmin: true, token: payload.token, errors: {}}, edit: {error: null}};
        case SUCCESS_CREATE: {
            const data = {
                ...state.data,
                tasks: [...state.data.tasks, payload],
                total_task_count: parseInt(state.data.total_task_count, 10) + 1
            };

            return {...state, data, create: initialState.create};
        }
        case SUCCESS_EDIT: {
            const data = {
                ...state.data,
                tasks: state.data.tasks.map(task => {
                    return task.id === payload.id ? {
                        ...task,
                        text: payload.data.text,
                        status: payload.data.status
                    } : task;
                })
            };

            return {...state, data, edit: initialState.edit};
        }
        case SUCCESS_LOGOUT:
            return {...state, auth: initialState.auth};
        case FAILED_LOGIN:
            return {...state, auth: {...state.auth, isLoading: false, isAuthorized: false, errors: payload}};
        case FAILED_CREATE:
            return {...state, create: {...state.create, isLoading: false, errors: payload}};
        case FAILED_EDIT:
            return {...state, edit: {...state.edit, isLoading: false, error: payload.token}};
        case FILTER_TASKS:
            return {...state, filterParams: {...state.filterParams, ...payload}};
        case RECEIVE_TASKS:
            return {...state, isFetching: false, data: payload};
        case FAILED_TASKS:
            return {...state, isFetching: false, error: payload};
        default:
            return state;
  }
}

export default rootReducer;