import React, { Component } from 'react';
import { Button, Classes, Dialog, FormGroup, InputGroup, TextArea } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { create, createDialog } from '../../actions';

class Create extends Component {
    constructor() {
        super();

        this.state = {
            username: '',
            email: '',
            text: ''
        };

        this.handleCreate = this.handleCreate.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleCreate() {
        const {username, email, text} = this.state;
        this.props.onCreate({username, email, text});
    }

    handleInput(e) {
        let {name, value} = e.target;

        this.setState({
            [name]: value
        });
    }

    render() {
        const {isOpen, isLoading, errors} = this.props,
            {username, email, text} = this.state;

        return (
            <Dialog
                className="App__create-dialog"
                isOpen={isOpen}
                onClose={() => this.props.onCreateDialog(false)}
                title="Создать задачу"
                canOutsideClickClose={false}
                enforceFocus
                usePortal
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup
                        label="Имя пользователя"
                        labelFor="username-input"
                        labelInfo="(обязательно)"
                        helperText={errors.username}
                        intent={errors.username ? 'danger' : 'none'}
                    >
                        <InputGroup
                            id="username-input"
                            name="username"
                            value={username}
                            onChange={this.handleInput}
                            intent={errors.username ? 'danger' : 'none'}
                        />
                    </FormGroup>
                    <FormGroup
                        label="E-mail"
                        labelFor="email-input"
                        labelInfo="(обязательно)"
                        helperText={errors.email}
                        intent={errors.email ? 'danger' : 'none'}
                    >
                        <InputGroup
                            id="email-input"
                            name="email"
                            value={email}
                            onChange={this.handleInput}
                            intent={errors.email ? 'danger' : 'none'}
                        />
                    </FormGroup>
                    <FormGroup
                        label="Описание"
                        labelFor="text-area"
                        labelInfo="(обязательно)"
                        helperText={errors.text}
                        intent={errors.text ? 'danger' : 'none'}
                    >
                        <TextArea
                            id="text-area"
                            name="text"
                            intent={errors.password ? 'danger' : 'none'}
                            onChange={this.handleInput}
                            value={text}
                            fill
                            growVertically
                            large
                        />
                    </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={() => this.props.onCreateDialog(false)}>Закрыть</Button>
                        <Button onClick={this.handleCreate} intent="primary" loading={isLoading}>Создать</Button>
                    </div>
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = ({create}) => ({...create});

const mapDispatchToProps = (dispatch) => ({
    onCreate: (params) => dispatch(create(params)),
    onCreateDialog: (isOpen) => dispatch(createDialog(isOpen))
});

export default connect(mapStateToProps, mapDispatchToProps)(Create);