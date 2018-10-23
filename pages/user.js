import withAuth from '../providers/with-auth';

const UserPage = ({ name }) => (
    <div>
        <h1>User page</h1>
        <h2>{ `I'm ${name}` }</h2>
    </div>
);

export default withAuth(UserPage);