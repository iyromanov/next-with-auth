import fetch from 'isomorphic-fetch';
import Router from 'next/router';

const UserPage = ({ name }) => (
    <div>
        <h1>User page</h1>
        <h2>{ `I'm ${name}` }</h2>
    </div>
);

UserPage.getInitialProps = async ({ req }) => {
    const resp = await fetch('http://localhost:3000/me', { headers: req.headers });
    // if (resp.status === 401) {
        // Router.replace('/');
    const data = await resp.json();
    return data;
}

export default UserPage;