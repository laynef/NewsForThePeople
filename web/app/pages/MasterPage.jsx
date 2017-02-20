import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Field, reduxForm } from 'redux-form'


class MasterPage extends Component {

    render() {
        const { children } = this.props;
        return (
            <div>
                { children }
            </div>
            )
        }
}

MasterPage = reduxForm({
    form: 'Master Page'
})(MasterPage)

export default connect(state => ({
}))(MasterPage)