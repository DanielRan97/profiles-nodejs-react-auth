import classes from "./usersList.module.css";


const UsersList = ({usersList}) => {


    const usersListDiv = usersList.map((user, index) => {
        return (
            <p key={index}>{user}</p>
        )
    })

    return(
        <div className={classes.usersList}>
            <h1>Users:</h1>
            {usersListDiv}
        </div>
    );
};

export default UsersList;