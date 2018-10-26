import fetch from 'isomorphic-fetch';
import Router from 'next/router';

/*
    TODO: 
        1. Add decorator factory
        2. Split client & server logic
        3. Webpack: remove server logic from client chunks
*/
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

        const userRes = await fetch('http://localhost:3000/user');

        if (!userRes.ok) {
            Router.push('/login');
            return props;
        }

        const user = await userRes.json();
        return {
            ...props,
            user
        };
    }

    return Component;
}