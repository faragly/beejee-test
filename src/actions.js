export const LOADING  = 'LOADING';
export const SET_LOGIN_DIALOG = 'SET_LOGIN_DIALOG';
export const SET_CREATE_DIALOG = 'SET_CREATE_DIALOG';
export const LOGIN_LOADING = 'LOGIN_LOADING';
export const CREATE_LOADING = 'CREATE_LOADING';
export const EDIT_LOADING = 'EDIT_LOADING';
export const SUCCESS_LOGIN = 'SUCCESS_LOGIN';
export const SUCCESS_LOGOUT = 'SUCCESS_LOGOUT';
export const SUCCESS_CREATE = 'SUCCESS_CREATE';
export const SUCCESS_EDIT = 'SUCCESS_EDIT';
export const FAILED_LOGIN = 'FAILED_LOGIN';
export const FAILED_CREATE = 'FAILED_CREATE';
export const FAILED_EDIT = 'FAILED_EDIT';
export const PAGINATE  = 'PAGINATE';
export const FILTER_TASKS = 'FILTER_TASKS';
export const RECEIVE_TASKS  = 'RECEIVE_TASKS';
export const FAILED_TASKS = 'FAILED_TASKS';

const LOCAL_STORAGE_KEY = 'beejee_auth';
const baseUrl = 'https://uxcandy.com/~shapoval/test-task-backend/v2/';

export function loading() {
    return {
        type: LOADING
    }
}

export function receiveTasks(data) {
    return {
        type: RECEIVE_TASKS,
        payload: data
    };
}

export function failedTasks(error) {
    return {
        type: FAILED_TASKS,
        payload: error
    };
}

export function loginLoading() {
    return {
        type: LOGIN_LOADING
    }
}

export function createLoading() {
    return {
        type: CREATE_LOADING
    }
}

export function editLoading(id) {
    return {
        type: EDIT_LOADING,
        payload: id
    }
}

export function successCreate(data) {
    return {
        type: SUCCESS_CREATE,
        payload: data
    };
}

export function successEdit(id, data) {
    return {
        type: SUCCESS_EDIT,
        payload: {id, data}
    };
}

export function failedCreate(error) {
    return {
        type: FAILED_CREATE,
        payload: error
    };
}

export function successLogin(data) {
    return {
        type: SUCCESS_LOGIN,
        payload: data
    };
}

export function failedLogin(error) {
    return {
        type: FAILED_LOGIN,
        payload: error
    };
}

export function failedEdit(error) {
    return {
        type: FAILED_EDIT,
        payload: error
    };
}

export function paginate(page) {
    return {
        type: PAGINATE,
        payload: page
    };
}

export function filter(params) {
    return {
        type: FILTER_TASKS,
        payload: params
    };
}

export function loginDialog(isOpen) {
    return {
        type: SET_LOGIN_DIALOG,
        payload: isOpen
    };
}

export function logout() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    return {
        type: SUCCESS_LOGOUT
    };
}

export function createDialog(isOpen) {
    return {
        type: SET_CREATE_DIALOG,
        payload: isOpen
    };
}

export const fetchData = (params = {}) => {
    return async (dispatch, getState) => {
        dispatch(loading());
        try {
            const {filterParams, page} = getState();
            const urlParams = new URLSearchParams(Object.entries({
                developer: 'Khalik',
                ...filterParams,
                ...params
            }));
            const response = await fetch(`${baseUrl}?${urlParams.toString()}`);
            const {status, message} = await response.json();

            if (status === 'ok') {
                if (params.page && params.page !== page) {
                    dispatch(paginate(params.page));
                }

                if (['sort_field', 'sort_direction'].some(field => params[field] !== filterParams[field])) {
                    dispatch(filter(params));
                }

                return dispatch(receiveTasks(message));
            }

            throw message || 'Произошла неизвестная ошибка!';
        } catch (error) {
            return dispatch(failedTasks(error));
        }
    }
}

export function checkLogin() {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY);

    return {
        type: token ? SUCCESS_LOGIN : FAILED_LOGIN,
        payload: {token}
    };
}

export const login = (data = {}) => {
    return async (dispatch) => {
        dispatch(loginLoading());
        try {
            const formData  = new FormData();
            for (const name in data) {
                formData.append(name, data[name]);
            }

            const response = await fetch(`${baseUrl}login?developer=Khalik`, {
                method: 'POST',
                body: formData
            });
            const {status, message} = await response.json();

            if (status === 'ok') {
                localStorage.setItem(LOCAL_STORAGE_KEY, message.token);
                dispatch(loginDialog(false));
                return dispatch(successLogin(message));
            }

            throw message;
        } catch (error) {
            return dispatch(failedLogin(error));
        }
    }
}

export const create = (data = {}) => {
    return async (dispatch) => {
        dispatch(createLoading());
        try {
            const formData  = new FormData();
            for (const name in data) {
                formData.append(name, data[name]);
            }

            const response = await fetch(`${baseUrl}create?developer=Khalik`, {
                method: 'POST',
                body: formData
            });
            const {status, message} = await response.json();

            if (status === 'ok') {
                dispatch(createDialog(false));
                return dispatch(successCreate(message));
            }

            throw message;
        } catch (error) {
            return dispatch(failedCreate(error));
        }
    }
}

export const edit = (id, data = {}) => {
    return async (dispatch) => {
        dispatch(editLoading(id));
        try {
            const token = localStorage.getItem(LOCAL_STORAGE_KEY),
                params = {...data, token},
                formData  = new FormData();

            for (const name in params) {
                formData.append(name, params[name]);
            }

            const response = await fetch(`${baseUrl}edit/${id}?developer=Khalik`, {
                method: 'POST',
                body: formData
            });
            const {status, message} = await response.json();

            if (status === 'ok') {
                return dispatch(successEdit(id, data));
            }

            dispatch(loginDialog(true));

            throw message;
        } catch (error) {
            return dispatch(failedEdit(error));
        }
    }
}