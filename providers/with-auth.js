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

        if (req) {
            if (req.user) {
                return {
                    ...props,
                    user: req.user
                };
            } else {
                res.writeHead(302, { Location: '/login' });
                res.end();
                return props;
            }
        }

        const meResp = await fetch('http://localhost:3000/me');

        if (meResp.status === 401) {
            Router.push('/login');
            return props;
        }

        const user = await meResp.json();
        return {
            ...props,
            user
        };
    }

    return Component;
}