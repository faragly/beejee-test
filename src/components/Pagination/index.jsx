import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { fetchData } from '../../actions';

class Pagination extends Component {
    static defaultProps = {
        before: 2,
        after: 2
    }

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(page) {
        this.props.onFetchData({
            page
        });
    }

    render() {
        const {totalPages, before, after, page} = this.props,
            visible = before + after + 1,
            start = Math.max(page - before, 1),
            end = Math.max(visible, page + after),
            dotsBefore = page > 3,
            dotsAfter = page < totalPages - 2;
        let elements = [];

        if (dotsBefore) {
            elements.push(<Button
                key="navigation_1"
                text="1"
                onClick={() => this.handleClick(1)}
            />, <Button key="dots_before" text="..." minimal disabled />);
        }

        for (let i = start; i <= Math.min(totalPages, end); i++) {
            elements.push(<Button
                key={`navigation_${i}`}
                active={page === i}
                text={i}
                onClick={() => this.handleClick(i)}
            />);
        }

        if (dotsAfter) {
            elements.push(<Button key="dots_after" text="..." minimal disabled />, <Button
                key={`navigation_${totalPages}`}
                text={totalPages}
                onClick={() => this.handleClick(totalPages)}
            />);
        }

        return <ButtonGroup>{elements}</ButtonGroup>;
    };
}

const mapDispatchToProps = (dispatch) => ({
    onFetchData: (params) => dispatch(fetchData(params))
});

export default connect(({isAdmin, page}) => ({isAdmin, page}), mapDispatchToProps)(Pagination);
