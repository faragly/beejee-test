import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Card, EditableText, Elevation, Spinner, Switch } from '@blueprintjs/core';
import { edit } from '../../actions';
import './index.scss';

class Task extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleChange() {
        const {id, text, status} = this.props;
        const newStatus = status === 0 ? 10: 0;

        if (this.props.status !== newStatus) {
            this.props.onEdit(id, {
                text,
                status: newStatus
            });
        }
    }

    handleEdit(text) {
        const {id, status} = this.props;

        if (this.props.text !== text) {
            this.props.onEdit(id, {
                text, status
            });
        }
    }

    render() {
        const {id, editId, email, username, isAdmin, isLoading, error, status, text} = this.props;

        return (
            <Fragment>
                {error && id === editId
                    ? <div class="bp3-callout bp3-intent-danger" style={{marginBottom: 10}}>
                        {error}
                    </div>
                    : ''}
                <Card className="Task" elevation={Elevation.ONE}>
                    {isLoading && id === editId ? <Spinner /> : <div>
                        <h3>{username}</h3>
                        <p>{email}</p>
                        <EditableText className="Task__descr" disabled={!isAdmin} defaultValue={text} onConfirm={this.handleEdit} />
                        <Switch checked={status === 10} label="Выполнена" onChange={this.handleChange} disabled={!isAdmin} />
                    </div>}
                </Card>
            </Fragment>
        )};
}

const mapStateToProps = ({
    auth: {isAdmin},
    edit: {id, isLoading, error}
}) => ({isAdmin, isLoading, error, editId: id});

const mapDispatchToProps = (dispatch) => ({
    onEdit: (id, params) => dispatch(edit(id, params))
});

export default connect(mapStateToProps, mapDispatchToProps)(Task);