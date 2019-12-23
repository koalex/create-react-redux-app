import CSS          from './User.module.css';
import React        from 'react';
import { connect }  from 'react-redux';
import PropTypes    from 'prop-types';
import { NavLink }  from 'react-router-dom';
import { loadUser } from 'modules/newModule/actionCreators/user';
import selectUser   from 'modules/newModule/selectors/user';

function User (props) {
    const submitHandle = ev => {
        ev.preventDefault();
        props.loadUser();
    };

    return (
        <div className={CSS['container']}>
            <form onSubmit={submitHandle} className={CSS['form']}>
                <button type="submit" disabled={props.isLoading}>
                    LOAD USER
                </button>
            </form>
            <br/>
            <NavLink exact to="/">Go to main page</NavLink>
        </div>

    );
}

User.propTypes = {
    user: PropTypes.object,
    isLoading: PropTypes.bool,
    loadUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: selectUser(state),
    isLoading: state.newModule.isLoading
});
const mapDispatchToProps = {loadUser};

export default connect(mapStateToProps, mapDispatchToProps)(User);
