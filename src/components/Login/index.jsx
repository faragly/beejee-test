import React, { Component } from 'react';
import { Button, Classes, Dialog, FormGroup, InputGroup } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { login, loginDialog } from '../../actions';

class Login extends Component {
    constructor() {
        super();

        this.state = {
            username: '',
            password: ''
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleLogin() {
        const {username, password} = this.state;
        this.props.onLogin({username, password});
    }

    handleInput(e) {
        const {name, value} = e.target;

        this.setState({
            [name]: value
        });
    }

    render() {
        const {isOpen, isLoading, errors} = this.props,
            {username, password} = this.state;

        return (
            <Dialog
                className="App__login-dialog"
                isOpen={isOpen}
                onClose={() => this.props.onLoginDialog(false)}
                title="Вход"
                canOutsideClickClose={false}
                enforceFocus
                usePortal
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup
                        label="Логин"
                        labelFor="login-input"
                        labelInfo="(обязательно)"
                        helperText={errors.username}
                        intent={errors.username ? 'danger' : 'none'}
                    >
                        <InputGroup
                            id="login-input"
                            name="username"
                            value={username}
                            onChange={this.handleInput}
                            intent={errors.username ? 'danger' : 'none'}
                        />
                    </FormGroup>
                    <FormGroup
                        label="Пароль"
                        labelFor="password-input"
                        labelInfo="(обязательно)"
                        helperText={errors.password}
                        intent={errors.password ? 'danger' : 'none'}
                    >
                        <InputGroup
                            id="password-input"
                            type="password"
                            name="password"
                            value={password}
                            onChange={this.handleInput}
                            intent={errors.password ? 'danger' : 'none'}
                        />
                    </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={() => this.props.onLoginDialog(false)}>Закрыть</Button>
                        <Button onClick={this.handleLogin} intent="primary" loading={isLoading}>Войти</Button>
                    </div>
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = ({auth}) => ({...auth});

const mapDispatchToProps = (dispatch) => ({
    onLogin: (params) => dispatch(login(params)),
    onLoginDialog: (isOpen) => dispatch(loginDialog(isOpen))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);