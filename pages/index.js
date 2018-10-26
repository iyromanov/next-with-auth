import withAuth from '../providers/with-auth';
import Layout from '../components/layout';

const MainPage = ({ user }) => (
    <Layout>
        <h1>User page</h1>
        <h2>{ `I'm ${user.name}` }</h2>
    </Layout>
);

export default withAuth(MainPage);