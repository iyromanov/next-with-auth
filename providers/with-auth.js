import fetch from 'isomorphic-fetch';
import Router from 'next/router';

export default function withAuth(Component) {
    const originalGetInitialProps = Component.getInitialProps;

    Component.getInitialProps = async function(input) {
        let props = {};
        
        if (originalGetInitialProps) {
            props = await originalGetInitialProps(props);
        }
        
        const { req, res } = input;

        const options = req && { headers: { cookie: req.headers.cookie } };

        const meResp = await fetch('http://localhost:3000/me', options);

        if (meResp.status === 401) {
            if (res) { // ssr
                res.writeHead(302, { Location: '/' });
                res.end();
            } else {   // client
                Router.push('/');
            }
            return props;
        }

        const data = await meResp.json();
        return {
            ...props,
            ...data
        };
    }

    return Component;
}