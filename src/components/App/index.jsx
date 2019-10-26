import React, { Component } from 'react';
import { ButtonGroup, Button, Card, NonIdealState, Spinner } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { fetchData, checkLogin, loginDialog, logout, createDialog } from '../../actions';
import Task from '../Task/index';
import Pagination from '../Pagination/index';
import Login from '../Login/index';
import Create from '../Create/index';
import './index.scss';

class App extends Component {
    static defaultProps = {
        data: {},
        filterParams: {}
    }

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.onFetchData();
        this.props.onCheckLogin();
    }

    handleChange(e) {
        let {name, value} = e.target;

        this.props.onFetchData({
            ...this.props.filterParams,
            [name]: value
        });
    }

    render() {
        const totalPages = Math.ceil(parseInt(this.props.data.total_task_count || 0, 10) / 3),
            {
                filterParams: {sort_direction: direction, sort_field: field},
                auth: {isAuthorized}
            } = this.props,
            fields = { id: 'ID', username: 'Username', email: 'E-mail', status: 'Status' };
        let fieldOptions = [];

        for (const [value, text] of Object.entries(fields)) {
            fieldOptions.push(<option key={`option_${value}`} value={value}>{text}</option>);
        }

        return this.props.isFetching
            ? <Spinner />
            : <div className="App">
                <Login />
                <Create />
                <div className="App__toolbar">
                    <select name="sort_field" onChange={this.handleChange} defaultValue={field}>
                        <option>Фильтр</option>
                        {fieldOptions}
                    </select>
                    <select name="sort_direction" onChange={this.handleChange} defaultValue={direction}>
                        <option>Направление</option>
                        <option value="asc">по возрастанию</option>
                        <option value="desc">по убыванию</option>
                    </select>
                    <ButtonGroup>
                        {isAuthorized
                            ? <Button text="Выйти" onClick={() => this.props.onLogout()} />
                            : <Button text="Войти" onClick={() => this.props.onLoginDialog(true)} />
                        }
                        <Button text="Создать задачу" onClick={() => this.props.onCreateDialog(true)} />
                    </ButtonGroup>
                </div>
                {this.props.error && <div class="bp3-callout bp3-intent-danger">
                    {this.props.error}
                </div>}
                {
                    this.props.data.tasks && this.props.data.tasks.length
                        ? this.props.data.tasks
                            .slice(0, 3)
                            .map(task => <Task key={`task_${task.id}`} {...task} />)
                        : <Card>
                            <NonIdealState
                                icon="search"
                                title="No results"
                            />
                        </Card>
                }
                {totalPages ? <Pagination totalPages={totalPages} /> : ''}
            </div>
    };
}

const mapStateToProps = (state) => ({...state});

const mapDispatchToProps = (dispatch) => ({
    onFetchData: (params) => dispatch(fetchData(params)),
    onCheckLogin: () => dispatch(checkLogin()),
    onLogout: () => dispatch(logout()),
    onLoginDialog: (isOpen) => dispatch(loginDialog(isOpen)),
    onCreateDialog: (isOpen) => dispatch(createDialog(isOpen))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);